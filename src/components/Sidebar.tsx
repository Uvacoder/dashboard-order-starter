import { IconType } from 'react-icons';
import { RiGithubLine, RiPaletteLine } from 'react-icons/ri';

import { Navbar, Popover, Stack } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';

import { SidebarButton, ThemePopover } from './';

interface SidebarProps {
  links: {
    icon: IconType;
    label: string;
  }[];
}

function Sidebar({ links }: SidebarProps) {
  const [active, setActive] = useLocalStorage({ key: 'link-index', defaultValue: 0 });
  const [themePopoverOpened, themePopoverHandler] = useDisclosure(false);

  return (
    <Navbar py="lg" px="md" sx={{ width: 'min-content', minHeight: '100vh' }} zIndex="3">
      <Navbar.Section grow>
        <Stack spacing={4}>
          {links.map((link, index) => (
            <SidebarButton
              {...link}
              key={link.label}
              active={index === active}
              onClick={() => setActive(index)}
            />
          ))}
        </Stack>
      </Navbar.Section>
      <Navbar.Section>
        <Stack spacing={4}>
          <ThemePopover
            position="right"
            opened={themePopoverOpened}
            onChange={themePopoverHandler.toggle}
          >
            <Popover.Target>
              <SidebarButton
                icon={RiPaletteLine}
                label="Theme"
                active={themePopoverOpened}
                onClick={themePopoverHandler.toggle}
              />
            </Popover.Target>
          </ThemePopover>
          <SidebarButton
            icon={RiGithubLine}
            label="Check out my GitHub!"
            onClick={() => window.open('https://github.com/nekusu', '_blank')}
          />
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
}

export default Sidebar;
