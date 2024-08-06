package flow

import (
	"encoding/json"
	"time"

	"github.com/qf0129/gox/logx"
)

type JobContext struct {
	InputMap       map[string]any
	InputJsonData  string
	OutputJsonData string
	Successed      bool
	// OutputMap      map[string]any
}

type JobHandler func(*JobContext)

type Job struct {
	Name    string
	Title   string
	Handler JobHandler
	Params  any
}

var Jobs = make(map[string]Job)

func AddJob(name, title string, handler JobHandler, params any) {
	Jobs[name] = Job{
		Name:    name,
		Title:   title,
		Handler: handler,
		Params:  params,
	}
}

func (c *JobContext) ReturnSuccess(result map[string]any) {
	c._return(true, result)
}
func (c *JobContext) ReturnFail(msg string) {
	c._return(false, map[string]any{"msg": msg})
}

func (c *JobContext) _return(successed bool, outputMap map[string]any) {
	c.Successed = successed
	jsonData, err := json.Marshal(outputMap)
	if err != nil {
		logx.Error(err.Error())
		return
	}
	c.OutputJsonData = string(jsonData)
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
	return json.Unmarshal([]byte(c.InputJsonData), obj)
}
