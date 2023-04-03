import ShowPage from './pages/show.svelte';
import EditPage from './pages/edit.svelte';
import IndexPage from './pages/index.svelte';
import SessionsPage from './pages/index.svelte';

const routes = [
  {
    name: '/',
    component: IndexPage,
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
