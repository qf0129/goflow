package flow

import (
	"fmt"
	"reflect"
	"strconv"
	"strings"

	"github.com/qf0129/gox/pkg/arrayx"
	"github.com/qf0129/gox/pkg/convertx"
	"github.com/qf0129/gox/pkg/logx"
)

const (

	// 条件组类型
	ConditionsTypeAnd = "and"
	ConditionsTypeOr  = "or"

	// 条件运算符
	ConditionOperatorIsNull            = "is_null"
	ConditionOperatorIsTrue            = "is_true"
	ConditionOperatorIsFalse           = "is_false"
	ConditionOperatorIsString          = "is_string"
	ConditionOperatorIsNumber          = "is_number"
	ConditionOperatorIsArray           = "is_array"
	ConditionOperatorIsMap             = "is_map"
	ConditionOperatorStringEqual       = "string_eq"
	ConditionOperatorStringContain     = "string_ct"
	ConditionOperatorNumberEqual       = "number_eq"
	ConditionOperatorNumberGreterThan  = "number_gt"
	ConditionOperatorNumberLessThan    = "number_lt"
	ConditionOperatorNumberGreterEqual = "number_ge"
	ConditionOperatorNumberLessEqual   = "number_le"

	// 条件运算符前缀
	ConditionOperatorPrefixIs     = "is"
	ConditionOperatorPrefixString = "string"
	ConditionOperatorPrefixNumber = "number"
)

type Condition struct {
	ValueA   JsonPath
	ValueB   JsonPath
	Operator string
	IsNot    bool
}

type ConditionGroup struct {
	ConditionsType string // and, or
	Conditions     []*Condition
}

func (c *ConditionGroup) Match(sourceA, sourceB, sourceC []byte) (bool, error) {
	results := []bool{}
	for _, con := range c.Conditions {
		result, err := con.check(sourceA, sourceB, sourceC)
		logx.Infof("CheckConditionResult: %v", result)
		if err != nil {
			logx.Warnf("CheckConditionErr: %v", err)
			return false, err
		}
		if con.IsNot {
			result = !result
		}
		if c.ConditionsType == ConditionsTypeOr && result {
			return true, nil
		}
		results = append(results, result)
	}
	if c.ConditionsType == ConditionsTypeAnd && !arrayx.Contains(results, false) {
		return true, nil
	}
	return false, nil
}

func (con *Condition) check(sourceA, sourceB, sourceC []byte) (bool, error) {
	valA, err := con.ValueA.Match(sourceA, sourceB, sourceC)
	if err != nil {
		if con.Operator == ConditionOperatorIsNull {
			return true, nil
		}
		return false, err
	}
	valB, err := con.ValueB.Match(sourceA, sourceB, sourceC)
	if err != nil {
		return false, err
	}
	logx.Infof("CheckConditionValue, valA=%v, operator=%s, valB=%v", valA, con.Operator, valB)
	operators := strings.Split(con.Operator, "_")
	if len(operators) == 2 {
		switch operators[0] {
		case ConditionOperatorPrefixIs:
			return con.checkIsValue(valA)
		case ConditionOperatorPrefixString:
			return con.checkStringValue(valA, valB)
		case ConditionOperatorPrefixNumber:
			return con.checkNumberValue(valA, valB)
		}
	}
	return false, fmt.Errorf("不支持的运算符: %s", con.Operator)
}

func (con *Condition) checkIsValue(valA any) (bool, error) {
	v := reflect.ValueOf(valA)
	switch con.Operator {
	case ConditionOperatorIsNull:
		return v.Kind() == reflect.Invalid, nil
	case ConditionOperatorIsNumber:
		_, err := strconv.ParseFloat(convertx.AnyToString(valA), 64)
		return err == nil, nil
	case ConditionOperatorIsTrue:
		return v.Kind() == reflect.Bool && v.Bool(), nil
	case ConditionOperatorIsFalse:
		return v.Kind() == reflect.Bool && !v.Bool(), nil
	case ConditionOperatorIsString:
		return v.Kind() == reflect.String, nil
	case ConditionOperatorIsArray:
		return v.Kind() == reflect.Slice || v.Kind() == reflect.Array, nil
	case ConditionOperatorIsMap:
		return v.Kind() == reflect.Map, nil
	default:
		return false, fmt.Errorf("不支持的运算符: %s", con.Operator)
	}
}

func (con *Condition) checkStringValue(valA, valB any) (bool, error) {
	strA := valA.(string)
	strB := valB.(string)
	switch con.Operator {
	case ConditionOperatorStringEqual:
		return strA == strB, nil
	case ConditionOperatorStringContain:
		return strings.Contains(strA, strB), nil
	default:
		return false, fmt.Errorf("不支持的运算符: %s", con.Operator)
	}
}

func (con *Condition) checkNumberValue(valA, valB any) (bool, error) {
	floatA, err := convertx.AnyToFloat64(valA)
	if err != nil {
		return false, err
	}
	floatB, err := convertx.AnyToFloat64(valB)
	if err != nil {
		return false, err
	}
	switch con.Operator {
	case ConditionOperatorNumberEqual:
		return floatA == floatB, nil
	case ConditionOperatorNumberGreterThan:
		return floatA > floatB, nil
	case ConditionOperatorNumberGreterEqual:
		return floatA >= floatB, nil
	case ConditionOperatorNumberLessThan:
		return floatA < floatB, nil
	case ConditionOperatorNumberLessEqual:
		return floatA <= floatB, nil
	default:
		return false, fmt.Errorf("不支持的运算符: %s", con.Operator)
	}
}
