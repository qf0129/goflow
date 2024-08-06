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

func (rule *ChoiceRule) matched(inputJson any) (bool, error) {
	inputValue, err := jsonpath.JsonPathLookup(inputJson, rule.JsonPath)
	if err != nil {
		logx.Warn("ChoiceRuleLookupJsonPathErr: %v", err)
		return false, err
	}

	switch rule.ValueType {
	case ChoiceRuleTypeBool:
		return rule.checkBoolValue(inputValue)
	case ChoiceRuleTypeString:
		return rule.checkStringValue(inputValue)
	case ChoiceRuleTypeInt:
		return rule.checkIntValue(inputValue)
	case ChoiceRuleTypeFloat:
		return rule.checkFloatValue(inputValue)
	case ChoiceRuleTypeList:
		return rule.checkListValue(inputValue)
	}
	return false, nil
}

func (rule *ChoiceRule) checkBoolValue(inputValue any) (bool, error) {
	inputVal := inputValue.(string)
	if rule.Operator != "eq" {
		return false, nil
	}
	if rule.TargetValue == "true" {
		if inputVal == "true" || inputVal == "1" {
			return true, nil
		}
	} else if rule.TargetValue == "false" {
		if inputVal == "false" || inputVal == "0" {
			return true, nil
		}
	}
	return false, nil
}

func (rule *ChoiceRule) checkStringValue(inputValue any) (bool, error) {
	inputVal := inputValue.(string)
	result := false
	switch rule.Operator {
	case ChoiceRuleOperatorEqual:
		result = inputVal == rule.TargetValue
	case ChoiceRuleOperatorNotEqual:
		result = inputVal != rule.TargetValue
	case ChoiceRuleOperatorIn:
		result = strings.Contains(rule.TargetValue, inputVal)
	case ChoiceRuleOperatorNotIn:
		result = !strings.Contains(rule.TargetValue, inputVal)
	case ChoiceRuleOperatorContain:
		result = strings.Contains(inputVal, rule.TargetValue)
	case ChoiceRuleOperatorNotContain:
		result = !strings.Contains(inputVal, rule.TargetValue)
	case ChoiceRuleOperatorRegexp:
		result = strings.Contains(inputVal, rule.TargetValue)
	}
	return result, nil
}

func (rule *ChoiceRule) checkIntValue(inputValue any) (bool, error) {
	inputVal, ok := inputValue.(int64)
	if !ok {
		return false, fmt.Errorf("InvalidInputIntValue: " + inputValue.(string))
	}
	targetVal, err := strconv.ParseInt(rule.TargetValue, 10, 64)
	if err != nil {
		return false, fmt.Errorf("InvalidTargetIntValue: " + err.Error())
	}

	result := false
	switch rule.Operator {
	case ChoiceRuleOperatorEqual:
		result = inputVal == targetVal
	case ChoiceRuleOperatorNotEqual:
		result = inputVal != targetVal
	case ChoiceRuleOperatorGreterThan:
		result = inputVal > targetVal
	case ChoiceRuleOperatorGreterEqual:
		result = inputVal >= targetVal
	case ChoiceRuleOperatorLessThan:
		result = inputVal < targetVal
	case ChoiceRuleOperatorLessEqual:
		result = inputVal <= targetVal
	}
	return result, nil
}

func (rule *ChoiceRule) checkFloatValue(inputValue any) (bool, error) {
	inputVal, ok := inputValue.(float64)
	if !ok {
		return false, fmt.Errorf("InvalidInputFloatValue: " + inputValue.(string))
	}
	targetVal, err := strconv.ParseFloat(rule.TargetValue, 64)
	if err != nil {
		return false, fmt.Errorf("InvalidTargetFloatValue: " + err.Error())
	}

	result := false
	switch rule.Operator {
	case ChoiceRuleOperatorEqual:
		result = inputVal == targetVal
	case ChoiceRuleOperatorNotEqual:
		result = inputVal != targetVal
	case ChoiceRuleOperatorGreterThan:
		result = inputVal > targetVal
	case ChoiceRuleOperatorGreterEqual:
		result = inputVal >= targetVal
	case ChoiceRuleOperatorLessThan:
		result = inputVal < targetVal
	case ChoiceRuleOperatorLessEqual:
		result = inputVal <= targetVal
	}
	return result, nil
}

func (rule *ChoiceRule) checkListValue(inputValue any) (bool, error) {
	inputVal := []string{}
	err := jsonx.Unmarshal([]byte(inputValue.(string)), &inputVal)
	if err != nil {
		return false, fmt.Errorf("InvalidTargetListValue: " + err.Error())
	}

	result := false
	switch rule.Operator {
	case ChoiceRuleOperatorContain:
		result = arrayx.HasStrItem(inputVal, rule.TargetValue)
	case ChoiceRuleOperatorNotContain:
		result = !arrayx.HasStrItem(inputVal, rule.TargetValue)
	}
	return result, nil
}
