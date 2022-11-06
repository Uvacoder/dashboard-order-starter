import { deleteDoc, doc, DocumentData, updateDoc } from 'firebase/firestore';
import { RiBook2Line } from 'react-icons/ri';
import { useFirestore } from 'reactfire';

import { Group } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

import { Sidebar } from './components';
import { Orders } from './features';

function App() {
  const firestore = useFirestore();
  const [visibleFilters, setVisibleFilters] = useLocalStorage({
    key: 'visible-filters',
    defaultValue: true,
  });
  const [visibleNumbers, setVisibleNumbers] = useLocalStorage({
    key: 'visible-numbers',
    defaultValue: true,
  });
  const toggleVisibleFilters = () => setVisibleFilters((prevState) => !prevState);
  const toggleVisibleNumbers = () => setVisibleNumbers((prevState) => !prevState);
  const editDocument = (path: string, { NO_ID_FIELD: id, ...props }: DocumentData) => {
    const docRef = doc(firestore, path, id);
    updateDoc(docRef, { ...props });
  };
  const deleteDocument = (path: string, { NO_ID_FIELD: id }: DocumentData) => {
    const docRef = doc(firestore, path, id);
    deleteDoc(docRef);
  };

  return (
    <Group spacing={0} noWrap>
      <Sidebar links={[{ icon: RiBook2Line, label: 'Orders' }]} />
      <Orders
        visibleFilters={visibleFilters}
        visibleNumbers={visibleNumbers}
        toggleVisibleFilters={toggleVisibleFilters}
        toggleVisibleNumbers={toggleVisibleNumbers}
        editDocument={editDocument}
        deleteDocument={deleteDocument}
      />
    </Group>
  );
}

export default App;
