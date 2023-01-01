# Vue TS Utils
Typescript utils for vue3

## Installation
```bash
npm install vue-ts-utils -D
```

## Usage
```tsx
import { defineComponent } from 'vue-ts-utils';
const Comp = defineComponent({
  props: {
    foo: String
  },
  created() {},
  render() {}
})
```

## Features
### Infer Attrs
```tsx
import { defineComponent } from 'vue-ts-utils';
type CompAttrs = {
  bar: number
}
const Comp = defineComponent({
  props: {
    foo: String
  },
  created() {},
  render() {}
}, { attrs: {} as CompAttrs})
```


## License

[MIT](https://opensource.org/licenses/MIT)
