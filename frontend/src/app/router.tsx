import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Skeleton } from '../components/ui/Skeleton';
import { HomePage } from '../pages/HomePage';
import { RequireOwner } from './RequireOwner';

const AboutPage = lazy(() => import('../pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const AchievementsPage = lazy(() =>
  import('../pages/AchievementsPage').then((m) => ({ default: m.AchievementsPage })),
);
const BlogPage = lazy(() => import('../pages/BlogPage').then((m) => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() =>
  import('../pages/BlogPostPage').then((m) => ({ default: m.BlogPostPage })),
);
const BlogTagPage = lazy(() =>
  import('../pages/BlogTagPage').then((m) => ({ default: m.BlogTagPage })),
);
const CertificationsPage = lazy(() =>
  import('../pages/CertificationsPage').then((m) => ({ default: m.CertificationsPage })),
);
const ContactPage = lazy(() =>
  import('../pages/ContactPage').then((m) => ({ default: m.ContactPage })),
);
const CvPage = lazy(() => import('../pages/CvPage').then((m) => ({ default: m.CvPage })));
const EducationPage = lazy(() =>
  import('../pages/EducationPage').then((m) => ({ default: m.EducationPage })),
);
const ExperiencePage = lazy(() =>
  import('../pages/ExperiencePage').then((m) => ({ default: m.ExperiencePage })),
);
const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);
const ProjectDetailPage = lazy(() =>
  import('../pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })),
);
const ProjectsPage = lazy(() =>
  import('../pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
);
const ServicesPage = lazy(() =>
  import('../pages/ServicesPage').then((m) => ({ default: m.ServicesPage })),
);

const LoginPage = lazy(() => import('../admin/LoginPage').then((m) => ({ default: m.LoginPage })));
const DashboardPage = lazy(() =>
  import('../admin/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const ProfilePage = lazy(() =>
  import('../admin/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const FontsPage = lazy(() => import('../admin/FontsPage').then((m) => ({ default: m.FontsPage })));
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
const TestimonialsListPage = lazy(() =>
  import('../admin/collections/testimonials/TestimonialsListPage').then((m) => ({
    default: m.TestimonialsListPage,
  })),
);
const TestimonialEditorPage = lazy(() =>
  import('../admin/collections/testimonials/TestimonialEditorPage').then((m) => ({
    default: m.TestimonialEditorPage,
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

function withSuspense(element: ReactNode): ReactNode {
  return <AdminSuspense>{element}</AdminSuspense>;
}

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/about', element: withSuspense(<AboutPage />) },
  { path: '/experience', element: withSuspense(<ExperiencePage />) },
  { path: '/education', element: withSuspense(<EducationPage />) },
  { path: '/certifications', element: withSuspense(<CertificationsPage />) },
  { path: '/achievements', element: withSuspense(<AchievementsPage />) },
  { path: '/projects', element: withSuspense(<ProjectsPage />) },
  { path: '/projects/:slug', element: withSuspense(<ProjectDetailPage />) },
  { path: '/services', element: withSuspense(<ServicesPage />) },
  { path: '/blog', element: withSuspense(<BlogPage />) },
  { path: '/blog/:slug', element: withSuspense(<BlogPostPage />) },
  { path: '/blog/tag/:tag', element: withSuspense(<BlogTagPage />) },
  { path: '/contact', element: withSuspense(<ContactPage />) },
  { path: '/cv', element: withSuspense(<CvPage />) },
  {
    path: '/admin/login',
    element: withSuspense(<LoginPage />),
  },
  { path: '/admin', element: protect(<DashboardPage />) },
  { path: '/admin/profile', element: protect(<ProfilePage />) },
  { path: '/admin/fonts', element: protect(<FontsPage />) },
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
  { path: '/admin/testimonials', element: protect(<TestimonialsListPage />) },
  { path: '/admin/testimonials/:id', element: protect(<TestimonialEditorPage />) },
  { path: '/admin/blog', element: protect(<PostsListPage />) },
  { path: '/admin/blog/:id', element: protect(<PostEditorPage />) },
  { path: '*', element: withSuspense(<NotFoundPage />) },
]);
