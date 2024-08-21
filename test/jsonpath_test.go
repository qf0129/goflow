package test

import (
	"encoding/json"
	"fmt"
	"os"
	"testing"

	"github.com/oliveagle/jsonpath"
)

func TestXxx(t *testing.T) {
	data, err := os.ReadFile("./jsonpath_data.json")
	if err != nil {
		panic(err)
	}

	var jsonData any
	json.Unmarshal([]byte(data), &jsonData)

	res, err := jsonpath.JsonPathLookup(jsonData, "$.store.book[?(@.price > 10)]")
	if err != nil {
		panic(err)
	}

	// pat, _ := jsonpath.Compile(`$.store.book[?(@.price < $.expensive)].price`)
	// res, err := pat.Lookup(jsonData)

	fmt.Printf(">> %+v\n", res)

	b, err := json.Marshal(res)
	if err != nil {
		panic(err)
	}
	fmt.Printf(">> %+v\n", string(b))

}
