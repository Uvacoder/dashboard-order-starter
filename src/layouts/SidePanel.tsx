import { ReactNode, useRef } from 'react';
import { DragSizing } from 'react-drag-sizing';

import { createStyles, Paper } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

interface SidePanelProps {
  children: ReactNode;
}

const useStyles = createStyles((theme) => ({
  handler: {
    '&:hover, &:active': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[4],

      '&::after': {
        content: '""',
        position: 'absolute',
        height: '10%',
        width: 4,
        top: '45%',
        left: 4,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[1],
        borderRadius: 2,
      },
    },
  },
}));

function SidePanel({ children }: SidePanelProps) {
  const { classes } = useStyles();
  const sidePanelRef = useRef<HTMLDivElement>(null);
  const [sidePanelWidth, setSidePanelWidth] = useLocalStorage({
    key: 'side-panel-width',
    defaultValue: 500,
  });

  return (
    <DragSizing
      border="left"
      style={{
        width: sidePanelWidth,
        minWidth: 400,
        maxWidth: '50vw',
        gridColumn: '2 / 3',
        gridRow: '1 / 3',
        zIndex: 2,
      }}
      handlerClassName={classes.handler}
      handlerWidth={12}
      onEnd={() => sidePanelRef.current && setSidePanelWidth(sidePanelRef.current.offsetWidth)}
    >
      <Paper ref={sidePanelRef} p="lg" withBorder sx={{
        height: '100vh',
        borderWidth: 0,
        borderLeftWidth: 1,
        borderRadius: 0,
        overflowY: 'scroll',
      }}>
        {children}
      </Paper>
    </DragSizing>
  );
}

export default SidePanel;
