import { forwardRef } from 'react';
import { IconType } from 'react-icons';

import { Button, createStyles, Tooltip } from '@mantine/core';

interface SidebarButtonProps {
  icon: IconType;
  label: string;
  active?: boolean;
  onClick?(): void;
}

const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
    },
  },
  active: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

const SidebarButton = forwardRef<HTMLButtonElement, SidebarButtonProps>(
  function SidebarButton({ icon: Icon, label, active, onClick }, ref) {
    const { classes, cx } = useStyles();

    return (
      <Tooltip label={label} position="right" disabled={active}>
        <Button
          ref={ref}
          variant="subtle"
          onClick={onClick}
          className={cx(classes.link, { [classes.active]: active })}
        >
          <Icon size={18} />
        </Button>
      </Tooltip>
    );
  },
);

export default SidebarButton;
