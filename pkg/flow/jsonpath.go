package flow

import (
	"bytes"
	"encoding/json"
	"fmt"
	"reflect"
	"strings"

	"github.com/oliveagle/jsonpath"
	"github.com/qf0129/gox/pkg/convertx"
	"github.com/qf0129/gox/pkg/strx"
)

type JsonPath string
type JsonFilter map[string]interface{}

func (j JsonPath) Match(sourceA, sourceB, sourceC []byte) (any, error) {
	return JsonMatchAny(j, sourceA, sourceB, sourceC)
}

func (j JsonFilter) Match(sourceA, sourceB, sourceC []byte) (map[string]any, error) {
	result, err := JsonMatchAny(j, sourceA, sourceB, sourceC)
	if err != nil {
		return nil, err
	}
	return result.(map[string]any), nil
}

func JsonMatchAny(jsonPathAny any, sourceA, sourceB, sourceC []byte) (any, error) {
	switch val := jsonPathAny.(type) {
	case JsonPath:
		return JsonMatchAny(string(val), sourceA, sourceB, sourceC)
	case JsonFilter:
		return JsonMatchAny(map[string]any(val), sourceA, sourceB, sourceC)
	case string:
		if strings.HasPrefix(val, "$$$") {
			return jsonMatch(strings.Replace(val, "$$$", "$", 1), sourceC)
		} else if strings.HasPrefix(val, "$$") {
			return jsonMatch(strings.Replace(val, "$$", "$", 1), sourceB)
		} else if strings.HasPrefix(val, "$") {
			return jsonMatch(val, sourceA)
		} else {
			return val, nil
		}
	case map[string]any:
		var err error
		result := make(map[string]any)
		for k, v := range val {
			result[k], err = JsonMatchAny(v, sourceA, sourceB, sourceC)
			if err != nil {
				return nil, err
			}
		}
		return result, nil
	case []any:
		result := []any{}
		for _, v := range val {
			newV, err := JsonMatchAny(v, sourceA, sourceB, sourceC)
			if err != nil {
				return nil, err
			}
			result = append(result, newV)
		}
		return result, nil
	default:
		return val, nil
	}
}

func jsonMatch(jsonPath string, jsonData []byte) (any, error) {
	jsonData = bytes.TrimSpace(jsonData)
	if len(jsonData) > 0 && jsonData[0] != '{' && jsonData[0] != '[' {
		if strx.IsDigitBytes(jsonData) {
			return convertx.StrToInt64(string(jsonData))
		} else {
			return string(jsonData), nil
		}
	}
	// 如果jsonpath是这两个值，返回原数据
	if jsonPath == "$." || jsonPath == "$" {
		return jsonData, nil
	}
	// 获取函数名
	funcName := getFuncName(jsonPath)
	if funcName != "" {
		// 移除jsonPath中的函数名
		jsonPath = strings.Replace(jsonPath, "$"+funcName+".", "$.", 1)
	}
	// 解析json到any类型
	var jsonObj any
	err := json.Unmarshal(jsonData, &jsonObj)
	if err != nil {
		return nil, err
	}
	// 执行jsonpath
	val, err := jsonpath.JsonPathLookup(jsonObj, jsonPath)
	if funcName == "" {
		return val, err
	}
	return runFunc(funcName, val, err)
}

// 执行jsonpath函数
func runFunc(funcName string, val any, err error) (any, error) {
	switch funcName {
	case "exists":
		return val != nil, nil
	case "len":
		v := reflect.ValueOf(val)
		if v.Kind() == reflect.Slice || v.Kind() == reflect.Array || v.Kind() == reflect.Map || v.Kind() == reflect.String {
			return v.Len(), nil
		} else {
			return 0, fmt.Errorf("无法获取%s对象的长度", v.Kind().String())
		}
	default:
		return fmt.Errorf("未知的jsonpath函数%s", funcName), err
	}
}

// 提取jsonpath中函数名
func getFuncName(jsonpath string) string {
	funcList := []string{"len", "exists"}
	for _, funcName := range funcList {
		if strings.HasPrefix(jsonpath, "$"+funcName+".") {
			return funcName
		}
	}
	return ""
}
