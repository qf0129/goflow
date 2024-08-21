package flow

import (
	"fmt"
	"strconv"
	"strings"

	"github.com/oliveagle/jsonpath"
	"github.com/qf0129/gox/arrayx"
	"github.com/qf0129/gox/jsonx"
	"github.com/qf0129/gox/logx"
)

func (choice *Choice) matched(inputJson any) (bool, error) {
	results := []bool{}

	for _, con := range choice.Conditions {
		inputValue, err := jsonpath.JsonPathLookup(inputJson, con.JsonPath)
		if err != nil {
			logx.Warn("ChoiceLookupJsonPathErr: %v", err)
			return false, err
		}

		var result bool
		switch con.ValueType {
		case ConditionValueTypeBool:
			result, err = con.checkBoolValue(inputValue)
		case ConditionValueTypeString:
			result, err = con.checkStringValue(inputValue)
		case ConditionValueTypeInt:
			result, err = con.checkIntValue(inputValue)
		case ConditionValueTypeFloat:
			result, err = con.checkFloatValue(inputValue)
		case ConditionValueTypeList:
			result, err = con.checkListValue(inputValue)
		}
		if err != nil {
			logx.Warn("CheckConditionErr: %v", err)
			return false, err
		}
		results = append(results, result)
	}

	if choice.Type == ChoiceTypeAnd && !arrayx.Contains[bool](results, false) {
		return true, nil
	} else if choice.Type == ChoiceTypeOr && arrayx.Contains[bool](results, true) {
		return true, nil
	}
	return false, nil
}

func (con *Condition) checkBoolValue(inputValue any) (bool, error) {
	inputVal := inputValue.(string)
	if con.Operator != "eq" {
		return false, nil
	}
	if con.Value == "true" {
		if inputVal == "true" || inputVal == "1" {
			return true, nil
		}
	} else if con.Value == "false" {
		if inputVal == "false" || inputVal == "0" {
			return true, nil
		}
	}
	return false, nil
}

func (con *Condition) checkStringValue(inputValue any) (bool, error) {
	inputVal := inputValue.(string)
	result := false
	switch con.Operator {
	case ConditionOperatorEqual:
		result = inputVal == con.Value
	case ConditionOperatorNotEqual:
		result = inputVal != con.Value
	case ConditionOperatorIn:
		result = strings.Contains(con.Value, inputVal)
	case ConditionOperatorNotIn:
		result = !strings.Contains(con.Value, inputVal)
	case ConditionOperatorContain:
		result = strings.Contains(inputVal, con.Value)
	case ConditionOperatorNotContain:
		result = !strings.Contains(inputVal, con.Value)
	case ConditionOperatorRegexp:
		result = strings.Contains(inputVal, con.Value)
	}
	return result, nil
}

func (con *Condition) checkIntValue(inputValue any) (bool, error) {
	inputVal, ok := inputValue.(int64)
	if !ok {
		return false, fmt.Errorf("InvalidInputIntValue: " + inputValue.(string))
	}
	targetVal, err := strconv.ParseInt(con.Value, 10, 64)
	if err != nil {
		return false, fmt.Errorf("InvalidTargetIntValue: " + err.Error())
	}

	result := false
	switch con.Operator {
	case ConditionOperatorEqual:
		result = inputVal == targetVal
	case ConditionOperatorNotEqual:
		result = inputVal != targetVal
	case ConditionOperatorGreterThan:
		result = inputVal > targetVal
	case ConditionOperatorGreterEqual:
		result = inputVal >= targetVal
	case ConditionOperatorLessThan:
		result = inputVal < targetVal
	case ConditionOperatorLessEqual:
		result = inputVal <= targetVal
	}
	return result, nil
}

func (con *Condition) checkFloatValue(inputValue any) (bool, error) {
	inputVal, ok := inputValue.(float64)
	if !ok {
		return false, fmt.Errorf("InvalidInputFloatValue: " + inputValue.(string))
	}
	targetVal, err := strconv.ParseFloat(con.Value, 64)
	if err != nil {
		return false, fmt.Errorf("InvalidTargetFloatValue: " + err.Error())
	}

	result := false
	switch con.Operator {
	case ConditionOperatorEqual:
		result = inputVal == targetVal
	case ConditionOperatorNotEqual:
		result = inputVal != targetVal
	case ConditionOperatorGreterThan:
		result = inputVal > targetVal
	case ConditionOperatorGreterEqual:
		result = inputVal >= targetVal
	case ConditionOperatorLessThan:
		result = inputVal < targetVal
	case ConditionOperatorLessEqual:
		result = inputVal <= targetVal
	}
	return result, nil
}

func (con *Condition) checkListValue(inputValue any) (bool, error) {
	inputVal := []string{}
	err := jsonx.Unmarshal([]byte(inputValue.(string)), &inputVal)
	if err != nil {
		return false, fmt.Errorf("InvalidTargetListValue: " + err.Error())
	}

	result := false
	switch con.Operator {
	case ConditionOperatorContain:
		result = arrayx.Contains[string](inputVal, con.Value)
	case ConditionOperatorNotContain:
		result = !arrayx.Contains[string](inputVal, con.Value)
	}
	return result, nil
}
