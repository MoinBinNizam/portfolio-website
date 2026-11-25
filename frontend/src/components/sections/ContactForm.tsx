import { zodResolver } from '@hookform/resolvers/zod';
import { ContactInputSchema, type ContactInput } from '@portfolio/shared';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { useToast } from '../ui/Toast';
import { useSubmitContact } from '../../features/contact/queries';
import { FormField } from '../../forms/FormField';

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const { notify } = useToast();
  const submitMutation = useSubmitContact();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactInputSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      honeypot: '',
    },
  });

  const onSubmit = async (values: ContactInput) => {
    setSent(false);
    try {
      await submitMutation.mutateAsync(values);
      setSent(true);
      reset();
      notify('Message sent. Thank you for reaching out.', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not send message', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Hidden honeypot field to catch automated bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-company-site">Website</label>
        <input
          id="contact-company-site"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('honeypot')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="contact-name" label="Your name" required error={errors.name?.message}>
          <Input
            id="contact-name"
            placeholder="Your full name"
            {...register('name')}
            error={errors.name?.message}
          />
        </FormField>

        <FormField id="contact-email" label="Email address" required error={errors.email?.message}>
          <Input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
        </FormField>
      </div>

      <FormField id="contact-message" label="Message" required error={errors.message?.message}>
        <Textarea
          id="contact-message"
          rows={4}
          placeholder="Tell me about your project, timeline, or role..."
          {...register('message')}
          error={errors.message?.message}
        />
      </FormField>

      {sent ? (
        <div
          role="status"
          className="rounded-input border border-accent bg-accent/10 px-4 py-3 text-sm font-medium text-accent"
        >
          Your message has been received. I will reply by email soon.
        </div>
      ) : null}

      <Button type="submit" disabled={isSubmitting || submitMutation.isPending}>
        {isSubmitting || submitMutation.isPending ? 'Sending...' : 'Send message'}
      </Button>
    </form>
  );
}
