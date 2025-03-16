package flow

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/qf0129/gox/pkg/logx"
)

type JobNode struct{}

func (n *JobNode) Handle(c *NodeContext) (b []byte, err error) {
	defer func() {
		if e := recover(); e != nil {
			err = fmt.Errorf("job执行异常, %v", e)
			c.Step.SetFail(err.Error())
		}
	}()

	if c.Node.JobGroup == "" || c.Node.JobName == "" {
		return nil, fmt.Errorf("job参数为空")
	}

	job := GetJob(c.Node.JobGroup, c.Node.JobName)
	if job == nil {
		return nil, fmt.Errorf("未知的Job: %s.%s", c.Node.JobGroup, c.Node.JobName)
	}

	ctx := &JobContext{InputJson: c.Step.Input, InputMap: make(map[string]any)}
	if err := json.Unmarshal(c.Step.Input, &ctx.InputMap); err != nil {
		return nil, fmt.Errorf("解析入参失败: %v", err)
	}

	if c.Node.PollingInterval > 0 && c.Node.PollingTimeout > 0 {
		return runJobWithPolling(c, job, ctx)
	} else if c.Node.RetryCount > 0 {
		return runJobWithRetry(c, job, ctx)
	} else {
		return runJobWithCommon(c, job, ctx)
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

func runJobWithPolling(c *NodeContext, job *Job, jobCtx *JobContext) (b []byte, err error) {
	timeout := time.Duration(c.Node.PollingTimeout) * time.Second
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
			if err = runJob(c, job, jobCtx); err != nil {
				return nil, err
			}
			if jobCtx.Successed {
				return jobCtx.OutputJson, nil
			}
			time.Sleep(time.Second * time.Duration(c.Node.PollingInterval))
			idx++
		}
	}
}

func runJobWithRetry(c *NodeContext, job *Job, ctx *JobContext) (b []byte, err error) {
	for i := 0; i < c.Node.RetryCount+1; i++ {
		if i > 0 {
			logx.Infof("--> 第%d次重试", i)
		}
		if err = runJob(c, job, ctx); err != nil {
			return nil, err
		}
		if ctx.Successed {
			return ctx.OutputJson, nil
		}
		time.Sleep(time.Second * time.Duration(c.Node.RetryInterval))
	}
	return nil, fmt.Errorf("重试%d次仍然失败, %s", c.Node.RetryCount, ctx.ErrMsg)
}

func runJobWithCommon(c *NodeContext, job *Job, ctx *JobContext) (b []byte, err error) {
	if err = runJob(c, job, ctx); err != nil {
		return nil, err
	} else if ctx.Successed {
		return ctx.OutputJson, nil
	} else {
		return nil, fmt.Errorf(ctx.ErrMsg)
	}
}

func runJob(c *NodeContext, job *Job, ctx *JobContext) (err error) {
	logx.Infof("执行job: %s.%s", c.Node.JobGroup, c.Node.JobName)
	if c.Node.Timeout > 0 {
		runJobWithTimeout(job.Handler, ctx, time.Second*time.Duration(c.Node.Timeout))
	} else {
		job.Handler(ctx)
	}

	// 自定义成功条件
	if c.Node.CompletedCondition != nil {
		matched, err := c.Node.CompletedCondition.Match(ctx.OutputJson, c.Execution.Input, c.Execution.Context)
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
