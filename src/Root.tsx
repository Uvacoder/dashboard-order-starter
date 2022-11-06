import { enableIndexedDbPersistence, initializeFirestore } from 'firebase/firestore';
import { FirestoreProvider, useInitFirestore } from 'reactfire';

import {
  ActionIconProps, Center, ColorScheme, ColorSchemeProvider, DefaultMantineColor, Loader,
  LoaderProps, MantineProvider, MantineThemeOverride, ModalProps, MultiSelectProps,
  NumberInputProps, PopoverProps, SelectProps, TextInputProps,
} from '@mantine/core';
import { useColorScheme, useLocalStorage } from '@mantine/hooks';
import { ModalsProvider } from '@mantine/modals';

import App from './App';

const ActionIconDefaultProps: Partial<ActionIconProps> = {
  size: 'lg',
  variant: 'subtle',
};
const LoaderDefaultProps: Partial<LoaderProps> = {
  size: 50,
};
const ModalDefaultProps: Partial<ModalProps> = {
  size: 'auto',
  shadow: 'lg',
  zIndex: 3,
  sx: { position: 'absolute', pointerEvents: 'auto' },
};
const NumberInputDefaultProps: Partial<NumberInputProps> = {
  precision: 0,
  removeTrailingZeros: true,
  stepHoldDelay: 500,
  stepHoldInterval: 50,
};
const PopoverDefaultProps: Partial<PopoverProps> = {
  shadow: 'lg',
};
const SelectDefaultProps: Partial<MultiSelectProps | SelectProps> = {
  clearable: true,
  maxDropdownHeight: 500,
  transition: 'fade',
  transitionDuration: 200,
  clearButtonTabIndex: -1,
};
const TextInputDefaultProps: Partial<TextInputProps> = {
  autoComplete: 'off',
};
const theme: MantineThemeOverride = {
  cursorType: 'pointer',
  defaultRadius: 'sm',
  loader: 'dots',
  components: {
    ActionIcon: { defaultProps: ActionIconDefaultProps },
    Loader: { defaultProps: LoaderDefaultProps },
    Modal: { defaultProps: ModalDefaultProps },
    MultiSelect: { defaultProps: SelectDefaultProps },
    NumberInput: { defaultProps: NumberInputDefaultProps },
    Popover: { defaultProps: PopoverDefaultProps },
    Select: { defaultProps: SelectDefaultProps },
    TextInput: { defaultProps: TextInputDefaultProps },
  },
};

function Root() {
  const { status, data: firestoreInstance } = useInitFirestore(async (firebaseApp) => {
    const db = initializeFirestore(firebaseApp, {});
    await enableIndexedDbPersistence(db);
    return db;
  });
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: preferredColorScheme,
  });
  const [primaryColor] = useLocalStorage<DefaultMantineColor>({
    key: 'primary-color',
    defaultValue: 'orange',
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  ModalDefaultProps.overlayOpacity = colorScheme === 'dark' ? 0.8 : 0.25;

  return (
    <MantineProvider
      theme={{ ...theme, colorScheme, primaryColor }}
      withNormalizeCSS
      withGlobalStyles
    >
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <ModalsProvider>
          {status === 'loading'
            ? (
              <Center sx={{ height: '100vh' }}>
                <Loader />
              </Center>
            ) : (
              <FirestoreProvider sdk={firestoreInstance}>
                <App />
              </FirestoreProvider>
            )}
        </ModalsProvider>
      </ColorSchemeProvider>
    </MantineProvider>
  );
}

export default Root;
