# Vue TS Utils
Typescript utils for vue3

## Installation
```bash
npm install vue-ts-utils -D
```

## Features
### Inferring Attrs
1. Option Component
```tsx
const Comp = defineComponent({
    slots: Object as SlotsType<{
        foo?: { data: string }
    }>,
    attrs: Object as AttrsType<{
        bar?: string
    }>,
    setup(props, { slots, attrs }) {
        console.log(attrs.bar)
        slots.foo?.({ data: 'a' })
    }
});
<Comp bar={"str"} />;
```
2. Functional Component
```tsx
const Comp = defineComponent(
  (props: { foo: string }, ctx) => {
    console.log(ctx.attrs.bar)
    return () => (
      <div>{props.foo}</div>
    )
  },
  {
    slots: Object as SlotsType<{
        baz?:  { data: string }
    }>,
    attrs: Object as AttrsType<{
      bar?: number
    }>
  }
);
<Comp bar={1} foo={"str"} />;
```

## License

[MIT](https://opensource.org/licenses/MIT)
