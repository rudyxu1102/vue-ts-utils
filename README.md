# Vue TS Utils
Typescript utils for vue3

## Installation
```bash
npm install vue-ts-utils -D
```

## Features
### Inferring Attrs
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
