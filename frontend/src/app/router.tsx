import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Skeleton } from '../components/ui/Skeleton';
import { AboutPage } from '../pages/AboutPage';
import { AchievementsPage } from '../pages/AchievementsPage';
import { BlogPage } from '../pages/BlogPage';
import { BlogPostPage } from '../pages/BlogPostPage';
import { BlogTagPage } from '../pages/BlogTagPage';
import { CertificationsPage } from '../pages/CertificationsPage';
import { ContactPage } from '../pages/ContactPage';
import { EducationPage } from '../pages/EducationPage';
import { ExperiencePage } from '../pages/ExperiencePage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProjectDetailPage } from '../pages/ProjectDetailPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ServicesPage } from '../pages/ServicesPage';
import { RequireOwner } from './RequireOwner';

const LoginPage = lazy(() => import('../admin/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() =>
  import('../admin/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const ProfilePage = lazy(() =>
  import('../admin/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const MessagesPage = lazy(() =>
  import('../admin/MessagesPage').then((m) => ({ default: m.MessagesPage })),
);
const ExperienceListPage = lazy(() =>
  import('../admin/collections/experience/ExperienceListPage').then((m) => ({
    default: m.ExperienceListPage,
  })),
);
const ExperienceEditorPage = lazy(() =>
  import('../admin/collections/experience/ExperienceEditorPage').then((m) => ({
    default: m.ExperienceEditorPage,
  })),
);
const EducationListPage = lazy(() =>
  import('../admin/collections/education/EducationListPage').then((m) => ({
    default: m.EducationListPage,
  })),
);
const EducationEditorPage = lazy(() =>
  import('../admin/collections/education/EducationEditorPage').then((m) => ({
    default: m.EducationEditorPage,
  })),
);
const CertificationsListPage = lazy(() =>
  import('../admin/collections/certifications/CertificationsListPage').then((m) => ({
    default: m.CertificationsListPage,
  })),
);
const CertificationEditorPage = lazy(() =>
  import('../admin/collections/certifications/CertificationEditorPage').then((m) => ({
    default: m.CertificationEditorPage,
  })),
);
const AchievementsListPage = lazy(() =>
  import('../admin/collections/achievements/AchievementsListPage').then((m) => ({
    default: m.AchievementsListPage,
  })),
);
const AchievementEditorPage = lazy(() =>
  import('../admin/collections/achievements/AchievementEditorPage').then((m) => ({
    default: m.AchievementEditorPage,
  })),
);
const ProjectsListPage = lazy(() =>
  import('../admin/collections/projects/ProjectsListPage').then((m) => ({
    default: m.ProjectsListPage,
  })),
);
const ProjectEditorPage = lazy(() =>
  import('../admin/collections/projects/ProjectEditorPage').then((m) => ({
    default: m.ProjectEditorPage,
  })),
);
const SkillsListPage = lazy(() =>
  import('../admin/collections/skills/SkillsListPage').then((m) => ({
    default: m.SkillsListPage,
  })),
);
const SkillEditorPage = lazy(() =>
  import('../admin/collections/skills/SkillEditorPage').then((m) => ({
    default: m.SkillEditorPage,
  })),
);
const ServicesListPage = lazy(() =>
  import('../admin/collections/services/ServicesListPage').then((m) => ({
    default: m.ServicesListPage,
  })),
);
const ServiceEditorPage = lazy(() =>
  import('../admin/collections/services/ServiceEditorPage').then((m) => ({
    default: m.ServiceEditorPage,
  })),
);
const PostsListPage = lazy(() =>
  import('../admin/collections/blog/PostsListPage').then((m) => ({
    default: m.PostsListPage,
  })),
);
const PostEditorPage = lazy(() =>
  import('../admin/collections/blog/PostEditorPage').then((m) => ({
    default: m.PostEditorPage,
  })),
);

function AdminSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background py-16">
          <Container className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-64 w-full" />
          </Container>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

function protect(element: ReactNode): ReactNode {
  return (
    <AdminSuspense>
      <RequireOwner>{element}</RequireOwner>
    </AdminSuspense>
  );
}

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/about', element: <AboutPage /> },
  { path: '/experience', element: <ExperiencePage /> },
  { path: '/education', element: <EducationPage /> },
  { path: '/certifications', element: <CertificationsPage /> },
  { path: '/achievements', element: <AchievementsPage /> },
  { path: '/projects', element: <ProjectsPage /> },
  { path: '/projects/:slug', element: <ProjectDetailPage /> },
  { path: '/services', element: <ServicesPage /> },
  { path: '/blog', element: <BlogPage /> },
  { path: '/blog/:slug', element: <BlogPostPage /> },
  { path: '/blog/tag/:tag', element: <BlogTagPage /> },
  { path: '/contact', element: <ContactPage /> },
  {
    path: '/admin/login',
    element: (
      <AdminSuspense>
        <LoginPage />
      </AdminSuspense>
    ),
  },
  { path: '/admin', element: protect(<DashboardPage />) },
  { path: '/admin/profile', element: protect(<ProfilePage />) },
  { path: '/admin/messages', element: protect(<MessagesPage />) },
  { path: '/admin/experience', element: protect(<ExperienceListPage />) },
  { path: '/admin/experience/:id', element: protect(<ExperienceEditorPage />) },
  { path: '/admin/education', element: protect(<EducationListPage />) },
  { path: '/admin/education/:id', element: protect(<EducationEditorPage />) },
  { path: '/admin/certifications', element: protect(<CertificationsListPage />) },
  { path: '/admin/certifications/:id', element: protect(<CertificationEditorPage />) },
  { path: '/admin/achievements', element: protect(<AchievementsListPage />) },
  { path: '/admin/achievements/:id', element: protect(<AchievementEditorPage />) },
  { path: '/admin/projects', element: protect(<ProjectsListPage />) },
  { path: '/admin/projects/:id', element: protect(<ProjectEditorPage />) },
  { path: '/admin/skills', element: protect(<SkillsListPage />) },
  { path: '/admin/skills/:id', element: protect(<SkillEditorPage />) },
  { path: '/admin/services', element: protect(<ServicesListPage />) },
  { path: '/admin/services/:id', element: protect(<ServiceEditorPage />) },
  { path: '/admin/blog', element: protect(<PostsListPage />) },
  { path: '/admin/blog/:id', element: protect(<PostEditorPage />) },
  { path: '*', element: <NotFoundPage /> },
]);
