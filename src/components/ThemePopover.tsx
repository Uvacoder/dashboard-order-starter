import { ReactNode, useEffect } from 'react';
import { RiCheckLine, RiMoonLine, RiSunLine } from 'react-icons/ri';

import {
  ColorScheme, ColorSwatch, DefaultMantineColor, Group, Popover, SegmentedControl, SimpleGrid,
  Stack, Text, Tooltip, useMantineColorScheme, useMantineTheme,
} from '@mantine/core';
import { FloatingPosition } from '@mantine/core/lib/Floating';
import { useLocalStorage } from '@mantine/hooks';

interface ThemePopoverProps {
  children: ReactNode;
  position: FloatingPosition;
  opened: boolean;
  onChange(opened: boolean): void;
}

const colors = new Set<string>();

function ThemePopover({
  children,
  position,
  opened,
  onChange,
}: ThemePopoverProps) {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [, setPrimaryColor] = useLocalStorage<DefaultMantineColor>({
    key: 'primary-color',
    defaultValue: 'orange',
  });

  useEffect(() => {
    Object.keys(theme.colors).forEach((color) => colors.add(color));
  }, []);

  return (
    <Popover
      position={position}
      opened={opened}
      onChange={onChange}
    >
      {children}
      <Popover.Dropdown>
        <Stack>
          <SegmentedControl
            data={[
              {
                label: (
                  <Group position="center" spacing="xs">
                    <RiSunLine /> Light
                  </Group>
                ),
                value: 'light',
              },
              {
                label: (
                  <Group position="center" spacing="xs">
                    <RiMoonLine /> Dark
                  </Group>
                ),
                value: 'dark',
              },
            ]}
            value={colorScheme}
            onChange={(value: ColorScheme) => toggleColorScheme(value)}
          />
          <SimpleGrid cols={Math.ceil(colors.size / 2)} spacing="xs">
            {[...colors].map((color) => (
              <Tooltip key={color} label={<Text transform="capitalize">{color}</Text>}>
                <ColorSwatch
                  component="button"
                  color={theme.colors[color][theme.fn.primaryShade()]}
                  radius="sm"
                  onClick={() => setPrimaryColor(color)}
                  sx={{ color: 'white', cursor: 'pointer' }}
                >
                  {theme.primaryColor === color && <RiCheckLine />}
                </ColorSwatch>
              </Tooltip>
            ))}
          </SimpleGrid>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export default ThemePopover;
