# walletconnect-registry

App Registry for WalletConnect Protocol

## Submit new App

1. Go to the "Issues" tab above
2. Press "New Issue"
3. Select "App Submission"
4. Fill in the template
5. Submit new issue

## API

```js
// Dapps
https://registry.walletconnect.org/data/dapps.json

// Wallets
https://registry.walletconnect.org/data/wallets.json

// Logos
// [size] = "sm" | "md" | "lg"
// [id] = present in app entry
https://registry.walletconnect.org/logo/[size]/[id].jpeg
```

## Schema

```typescript
interface AppEntry {
  id: string;
  name: string;
  homepage: string;
  chains: string[];
  app: {
    browser: string;
    ios: string;
    android: string;
    mac: string;
    windows: string;
    linux: string;
  };
  mobile: {
    native: string;
    universal: string;
  };
  desktop: {
    native: string;
    universal: string;
  };
  metadata: {
    shortName: string;
    colors: {
      primary: string;
      secondary: string;
    };
  };
}

interface AppRegistry {
  [id: string]: AppEntry;
}
```

## License

MIT


