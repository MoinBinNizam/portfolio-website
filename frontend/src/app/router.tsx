import { createBrowserRouter } from 'react-router-dom';
import { AchievementEditorPage } from '../admin/collections/achievements/AchievementEditorPage';
import { AchievementsListPage } from '../admin/collections/achievements/AchievementsListPage';
import { CertificationEditorPage } from '../admin/collections/certifications/CertificationEditorPage';
import { CertificationsListPage } from '../admin/collections/certifications/CertificationsListPage';
import { EducationEditorPage } from '../admin/collections/education/EducationEditorPage';
import { EducationListPage } from '../admin/collections/education/EducationListPage';
import { ExperienceEditorPage } from '../admin/collections/experience/ExperienceEditorPage';
import { ExperienceListPage } from '../admin/collections/experience/ExperienceListPage';
import { AchievementsPage } from '../pages/AchievementsPage';
import { CertificationsPage } from '../pages/CertificationsPage';
import { CollectionStubPage } from '../pages/CollectionStubPage';
import { ContactPage } from '../pages/ContactPage';
import { EducationPage } from '../pages/EducationPage';
import { ExperiencePage } from '../pages/ExperiencePage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    path: '/about',
    element: (
      <CollectionStubPage
        eyebrow="About"
        title="Biography & working principles"
        description="Full background, engineering values, and working approach."
        path="/about"
      />
    ),
  },
  {
    path: '/experience',
    element: <ExperiencePage />,
  },
  {
    path: '/education',
    element: <EducationPage />,
  },
  {
    path: '/certifications',
    element: <CertificationsPage />,
  },
  {
    path: '/achievements',
    element: <AchievementsPage />,
  },
  { path: '/admin/experience', element: <ExperienceListPage /> },
  { path: '/admin/experience/:id', element: <ExperienceEditorPage /> },
  { path: '/admin/education', element: <EducationListPage /> },
  { path: '/admin/education/:id', element: <EducationEditorPage /> },
  { path: '/admin/certifications', element: <CertificationsListPage /> },
  { path: '/admin/certifications/:id', element: <CertificationEditorPage /> },
  { path: '/admin/achievements', element: <AchievementsListPage /> },
  { path: '/admin/achievements/:id', element: <AchievementEditorPage /> },
  {
    path: '/projects',
    element: (
      <CollectionStubPage
        eyebrow="Projects"
        title="All projects"
        description="Filterable archive of full-stack, frontend, backend, and WordPress projects."
        path="/projects"
      />
    ),
  },
  {
    path: '/projects/:slug',
    element: (
      <CollectionStubPage
        eyebrow="Project"
        title="Project case study"
        description="Architecture, gallery, stack, and live links."
        path="/projects"
      />
    ),
  },
  {
    path: '/services',
    element: (
      <CollectionStubPage
        eyebrow="Services"
        title="Engineering services"
        description="Consulting and full-stack product delivery offerings."
        path="/services"
      />
    ),
  },
  {
    path: '/blog',
    element: (
      <CollectionStubPage
        eyebrow="Blog"
        title="Articles & notes"
        description="Technical writing on MERN, TypeScript, and web performance."
        path="/blog"
      />
    ),
  },
  {
    path: '/blog/:slug',
    element: (
      <CollectionStubPage
        eyebrow="Blog"
        title="Article"
        description="Technical article."
        path="/blog"
      />
    ),
  },
  {
    path: '/blog/tag/:tag',
    element: (
      <CollectionStubPage
        eyebrow="Blog"
        title="Articles by tag"
        description="Filtered blog posts by tag."
        path="/blog"
      />
    ),
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  { path: '*', element: <NotFoundPage /> },
]);
