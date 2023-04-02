import NewPage from './pages/new.svelte';
import ShowPage from './pages/show.svelte';
import EditPage from './pages/edit.svelte';
import SessionsPage from './pages/index.svelte';

const routes = [
  {
    name: '/',
    component: NewPage,
  },
  {
    name: 'sessions',
    component: SessionsPage,
  },
  {
    name: 'show/:id',
    component: ShowPage,
  },
  {
    name: 'edit/:id',
    component: EditPage,
  },
];

export { routes };
