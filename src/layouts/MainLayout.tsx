import { ReactNode } from 'react';

import { Box, createStyles, Header, Title } from '@mantine/core';

import { SidePanel } from './';

interface MainLayoutProps {
  headerTitle: string;
  header: ReactNode;
  body: ReactNode;
  sidePanel: ReactNode;
}

const useStyles = createStyles(() => ({
  grid: {
    display: 'grid',
    height: '100vh',
    gridTemplateColumns: '1fr auto',
    gridTemplateRows: 'auto 1fr',
    flex: 1,
  },
  modalContainer: {
    height: '100vh',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  },
}));

function MainLayout({ headerTitle, header, body, sidePanel }: MainLayoutProps) {
  const { classes, cx } = useStyles();

  return (
    <Box className={classes.grid}>
      <Header height="fit-content" p="lg" zIndex={2} sx={{ position: 'relative' }}>
        <Box className={cx(classes.modalContainer, 'modal-container')} />
        <Title order={1} mb="md">{headerTitle}</Title>
        {header}
      </Header>
      <Box sx={{ overflow: 'scroll' }}>
        {body}
      </Box>
      <SidePanel>
        {sidePanel}
      </SidePanel>
    </Box>
  );
}

export default MainLayout;
