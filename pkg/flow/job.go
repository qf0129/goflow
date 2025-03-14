package flow

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/qf0129/gox/pkg/logx"
)

type JobContext struct {
	InputMap   map[string]any
	InputJson  []byte
	OutputJson []byte
	Successed  bool
	ErrMsg     string
}

type JobHandler func(*JobContext)

type Job struct {
	Group        string      // job分组
	Name         string      // job名称
	Title        string      // job标题
	Handler      JobHandler  `json:"-"` // job执行函数
	InputStruct  interface{} // 入参结构体, 用于前端jsonpath提示
	OutputStruct interface{} // 出参结构体, 用于前端jsonpath提示
}

var Jobs = []Job{}

func RegisterJob(group, name, title string, handler JobHandler, inputStruct any, outputStruct any) {
	for _, j := range Jobs {
		if j.Group == group && j.Name == name {
			panic("Job " + group + "." + name + "已存在")
		}
	}
	Jobs = append(Jobs, Job{
		Group:        group,
		Name:         name,
		Title:        title,
		Handler:      handler,
		InputStruct:  inputStruct,
		OutputStruct: outputStruct,
	})
	fmt.Printf("RegisterJob: %s.%s\n", group, name)
}

func GetJob(group, name string) *Job {
	for _, j := range Jobs {
		if j.Group == group && j.Name == name {
			return &j
		}
	}
	return nil
}

func (c *JobContext) SetSuccess(result map[string]any) {
	jsonData, err := json.Marshal(result)
	if err != nil {
		logx.Error(err.Error())
		return
	}
	c.SetSuccessJson(jsonData)
}

func (c *JobContext) SetSuccessJson(result []byte) {
	c.OutputJson = result
	c.Successed = true
}

func (c *JobContext) SetFail(msg string) {
	c.ErrMsg = msg
	c.Successed = false
}

func (c *JobContext) Get(key string) (value any, exists bool) {
	value, exists = c.InputMap[key]
	return
}

func (c *JobContext) GetString(key string) (s string) {
	if val, ok := c.Get(key); ok && val != nil {
		s, _ = val.(string)
	}
	return
}

func (c *JobContext) GetBool(key string) (b bool) {
	if val, ok := c.Get(key); ok && val != nil {
		b, _ = val.(bool)
	}
	return
}

func (c *JobContext) GetInt(key string) (i int) {
	if val, ok := c.Get(key); ok && val != nil {
		i, _ = val.(int)
	}
	return
}

func (c *JobContext) GetInt64(key string) (i64 int64) {
	if val, ok := c.Get(key); ok && val != nil {
		i64, _ = val.(int64)
	}
	return
}

func (c *JobContext) GetUint(key string) (ui uint) {
	if val, ok := c.Get(key); ok && val != nil {
		ui, _ = val.(uint)
	}
	return
}

func (c *JobContext) GetUint64(key string) (ui64 uint64) {
	if val, ok := c.Get(key); ok && val != nil {
		ui64, _ = val.(uint64)
	}
	return
}

func (c *JobContext) GetFloat64(key string) (f64 float64) {
	if val, ok := c.Get(key); ok && val != nil {
		f64, _ = val.(float64)
	}
	return
}

func (c *JobContext) GetTime(key string) (t time.Time) {
	if val, ok := c.Get(key); ok && val != nil {
		t, _ = val.(time.Time)
	}
	return
}

func (c *JobContext) GetDuration(key string) (d time.Duration) {
	if val, ok := c.Get(key); ok && val != nil {
		d, _ = val.(time.Duration)
	}
	return
}

func (c *JobContext) GetStringSlice(key string) (ss []string) {
	if val, ok := c.Get(key); ok && val != nil {
		ss, _ = val.([]string)
	}
	return
}

func (c *JobContext) GetStringMap(key string) (sm map[string]any) {
	if val, ok := c.Get(key); ok && val != nil {
		sm, _ = val.(map[string]any)
	}
	return
}

func (c *JobContext) GetStringMapString(key string) (sms map[string]string) {
	if val, ok := c.Get(key); ok && val != nil {
		sms, _ = val.(map[string]string)
	}
	return
}

func (c *JobContext) GetStringMapStringSlice(key string) (smss map[string][]string) {
	if val, ok := c.Get(key); ok && val != nil {
		smss, _ = val.(map[string][]string)
	}
	return
}

func (c *JobContext) ShouldBindJSON(obj any) error {
	return json.Unmarshal(c.InputJson, obj)
}
