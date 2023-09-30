# Vue TS Utils
Typescript utils for vue2 and Vue3

## Installation
```bash
npm install vue-ts-utils -D
```

## Features
### Inferring Attrs
### 1. Wrapping a html element
```tsx
import { defineComponent, type AttrsType } from 'vue-ts-utils';
import { type ImgHTMLAttributes } from 'vue';
const MyImg = defineComponent({
    props: {
        foo: String
    },
    attrs: Object as AttrsType<ImgHTMLAttributes>,
    created() {
        this.$attrs.class // any
        this.$attrs.style // StyleValue | undefined
    },
    render() {
        return <img {...this.$attrs} />
    }
});
<MyImg class={'str'} style={'str'} src={'str'} />;
```

### 2. Wrapping a component
```tsx
import { defineComponent, type AttrsType } from 'vue-ts-utils';

const Child = defineComponent({
    props: {
        foo: String
    },
    emits: {
        baz: (val: number) => true
    },
    render() {
        return <div>{this.foo}</div>
    }
});

const Comp = defineComponent({
    props: {
        bar: Number
    },
    attrs: Object as AttrsType<typeof Child>,
    created() {
        this.$attrs.class // unknown
        this.$attrs.style // unknown
    },
    render() {
        return <Child {...this.$attrs} />
    }
});

<Comp class={'str'} style={'str'} bar={1} foo={'str'} onBaz={(val) => { 
    val; // number
}} />;
```
### Inferring Inject
```tsx
import { defineComponent } from 'vue-ts-utils';

const Child = defineComponent({
    props: {
        foo: String
    },
    inject: ['bar'],
    created() {
        this.bar; // unknown
    },
    render() {
        return <div>{this.foo}</div>
    }
});


## License

[MIT](https://opensource.org/licenses/MIT)
