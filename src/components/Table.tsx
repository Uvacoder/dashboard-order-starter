import { ReactNode } from 'react';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import { createStyles, Table as MantineTable } from '@mantine/core';

interface TableProps {
  headerCellElements: ReactNode;
  bodyCellElements: ReactNode;
}

const useStyles = createStyles((theme) => ({
  thead: {
    height: 50,
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backgroundColor: theme.colorScheme === 'dark'
      ? theme.colors.dark[8]
      : theme.colors.gray[1],
  },
}));

function Table({ headerCellElements, bodyCellElements }: TableProps) {
  const { classes } = useStyles();
  const [tableBody] = useAutoAnimate<HTMLTableSectionElement>();

  return (
    <MantineTable
      verticalSpacing="xs"
      horizontalSpacing="lg"
      sx={{ position: 'relative' }}
    >
      <thead className={classes.thead}>
        {headerCellElements}
      </thead>
      <tbody ref={tableBody}>{bodyCellElements}</tbody>
    </MantineTable>
  );
}

export default Table;
