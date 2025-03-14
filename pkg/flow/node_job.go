package flow

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/qf0129/gox/pkg/logx"
)

type JobNode struct{}

func (n *JobNode) Handle(o *NodeContext) (b []byte, err error) {
	defer func() {
		if e := recover(); e != nil {
			err = fmt.Errorf("job执行异常, %v", e)
			logx.Errorf("stack: \n%s\033[0m", Stack(3))
			o.Step.SetFail(err.Error())
		}
	}()

	if o.Node.JobGroup == "" || o.Node.JobName == "" {
		return nil, fmt.Errorf("job参数为空")
	}

	job := GetJob(o.Node.JobGroup, o.Node.JobName)
	if job == nil {
		return nil, fmt.Errorf("未知的Job: %s.%s", o.Node.JobGroup, o.Node.JobName)
	}

	ctx := &JobContext{InputJson: o.Step.Input, InputMap: make(map[string]any)}
	if err := json.Unmarshal(o.Step.Input, &ctx.InputMap); err != nil {
		return nil, fmt.Errorf("解析入参失败: %v", err)
	}

	if o.Node.PollingInterval > 0 && o.Node.PollingTimeout > 0 {
		return runJobWithPolling(o, job, ctx)
	} else if o.Node.RetryCount > 0 {
		return runJobWithRetry(o, job, ctx)
	} else {
		return runJobWithCommon(o, job, ctx)
	}
}

func (n *JobNode) Check(node *Node) error {
	if node.JobGroup == "" {
		return fmt.Errorf("任务分组不能为空")
	}
	if node.JobName == "" {
		return fmt.Errorf("任务名称不能为空")
	}
	return nil
}

func runJobWithPolling(o *NodeContext, job *Job, jobCtx *JobContext) (b []byte, err error) {
	timeout := time.Duration(o.Node.PollingTimeout) * time.Second
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()

	var idx = 0
	for {
		select {
		case <-ctx.Done():
			err = fmt.Errorf("轮询超时， 超时时间=%s", timeout.String())
			jobCtx.SetFail(err.Error())
			return nil, err
		default:
			logx.Infof("--> 轮询第%d次", idx)
			if err = runJob(o, job, jobCtx); err != nil {
				return nil, err
			}
			if jobCtx.Successed {
				return jobCtx.OutputJson, nil
			}
			time.Sleep(time.Second * time.Duration(o.Node.PollingInterval))
			idx++
		}
	}
}

func runJobWithRetry(o *NodeContext, job *Job, ctx *JobContext) (b []byte, err error) {
	for i := 0; i < o.Node.RetryCount+1; i++ {
		if i > 0 {
			logx.Infof("--> 第%d次重试", i)
		}
		if err = runJob(o, job, ctx); err != nil {
			return nil, err
		}
		if ctx.Successed {
			return ctx.OutputJson, nil
		}
		time.Sleep(time.Second * time.Duration(o.Node.RetryInterval))
	}
	return nil, fmt.Errorf("重试%d次仍然失败, %s", o.Node.RetryCount, ctx.ErrMsg)
}

func runJobWithCommon(o *NodeContext, job *Job, ctx *JobContext) (b []byte, err error) {
	if err = runJob(o, job, ctx); err != nil {
		return nil, err
	} else if ctx.Successed {
		return ctx.OutputJson, nil
	} else {
		return nil, fmt.Errorf(ctx.ErrMsg)
	}
}

func runJob(o *NodeContext, job *Job, ctx *JobContext) (err error) {
	logx.Infof("执行job: %s.%s", o.Node.JobGroup, o.Node.JobName)
	if o.Node.Timeout > 0 {
		runJobWithTimeout(job.Handler, ctx, time.Second*time.Duration(o.Node.Timeout))
	} else {
		job.Handler(ctx)
	}

	// 自定义成功条件
	if o.Node.CompletedCondition != nil {
		matched, err := o.Node.CompletedCondition.Match(ctx.OutputJson, o.Execution.Input, o.Execution.Context)
		if err != nil {
			logx.Errorf("处理自定义成功条件错误: %s", err.Error())
			return err
		} else if matched {
			ctx.SetSuccessJson(ctx.OutputJson)
		} else {
			ctx.SetFail("不满足自定义成功条件")
		}
	}
	return nil
}

func runJobWithTimeout(handler JobHandler, ctx *JobContext, timeout time.Duration) {
	ch := make(chan int, 1)
	go func() {
		handler(ctx)
		ch <- 1
	}()
	select {
	case <-time.After(timeout):
		logx.Errorf("执行job超时, 超时时间=%s", timeout.String())
		ctx.SetFail("执行job超时")
		return
	case <-ch:
		logx.Info("job执行完成")
	}
}
