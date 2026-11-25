import { createBrowserRouter } from 'react-router-dom';
import { DashboardPage } from '../admin/DashboardPage';
import { LoginPage } from '../admin/LoginPage';
import { MessagesPage } from '../admin/MessagesPage';
import { ProfilePage } from '../admin/ProfilePage';
import { AchievementEditorPage } from '../admin/collections/achievements/AchievementEditorPage';
import { AchievementsListPage } from '../admin/collections/achievements/AchievementsListPage';
import { CertificationEditorPage } from '../admin/collections/certifications/CertificationEditorPage';
import { CertificationsListPage } from '../admin/collections/certifications/CertificationsListPage';
import { EducationEditorPage } from '../admin/collections/education/EducationEditorPage';
import { EducationListPage } from '../admin/collections/education/EducationListPage';
import { ExperienceEditorPage } from '../admin/collections/experience/ExperienceEditorPage';
import { ExperienceListPage } from '../admin/collections/experience/ExperienceListPage';
import { ProjectEditorPage } from '../admin/collections/projects/ProjectEditorPage';
import { ProjectsListPage } from '../admin/collections/projects/ProjectsListPage';
import { ServiceEditorPage } from '../admin/collections/services/ServiceEditorPage';
import { ServicesListPage } from '../admin/collections/services/ServicesListPage';
import { SkillEditorPage } from '../admin/collections/skills/SkillEditorPage';
import { SkillsListPage } from '../admin/collections/skills/SkillsListPage';
import { AchievementsPage } from '../pages/AchievementsPage';
import { CertificationsPage } from '../pages/CertificationsPage';
import { CollectionStubPage } from '../pages/CollectionStubPage';
import { ContactPage } from '../pages/ContactPage';
import { EducationPage } from '../pages/EducationPage';
import { ExperiencePage } from '../pages/ExperiencePage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ServicesPage } from '../pages/ServicesPage';
import { RequireOwner } from './RequireOwner';

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
  { path: '/admin/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: (
      <RequireOwner>
        <DashboardPage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/profile',
    element: (
      <RequireOwner>
        <ProfilePage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/messages',
    element: (
      <RequireOwner>
        <MessagesPage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/experience',
    element: (
      <RequireOwner>
        <ExperienceListPage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/experience/:id',
    element: (
      <RequireOwner>
        <ExperienceEditorPage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/education',
    element: (
      <RequireOwner>
        <EducationListPage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/education/:id',
    element: (
      <RequireOwner>
        <EducationEditorPage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/certifications',
    element: (
      <RequireOwner>
        <CertificationsListPage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/certifications/:id',
    element: (
      <RequireOwner>
        <CertificationEditorPage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/achievements',
    element: (
      <RequireOwner>
        <AchievementsListPage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/achievements/:id',
    element: (
      <RequireOwner>
        <AchievementEditorPage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/projects',
    element: (
      <RequireOwner>
        <ProjectsListPage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/projects/:id',
    element: (
      <RequireOwner>
        <ProjectEditorPage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/skills',
    element: (
      <RequireOwner>
        <SkillsListPage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/skills/:id',
    element: (
      <RequireOwner>
        <SkillEditorPage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/services',
    element: (
      <RequireOwner>
        <ServicesListPage />
      </RequireOwner>
    ),
  },
  {
    path: '/admin/services/:id',
    element: (
      <RequireOwner>
        <ServiceEditorPage />
      </RequireOwner>
    ),
  },
  {
    path: '/projects',
    element: <ProjectsPage />,
  },
  {
    path: '/projects/:slug',
    element: <ProjectDetailPage />,
  },
  {
    path: '/services',
    element: <ServicesPage />,
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
