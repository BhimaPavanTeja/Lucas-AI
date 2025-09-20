'use client';

import type { Resource } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Library, Link as LinkIcon } from 'lucide-react';

interface ResourceVaultProps {
  resources: Resource[];
}

export default function ResourceVault({ resources }: ResourceVaultProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Library className="h-6 w-6 text-primary" />
          <span>Resource Vault</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {resources.length > 0 ? (
          <ul className="space-y-3">
            {resources.map((resource) => (
              <li key={resource.id}>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-md bg-background p-3 transition-colors hover:bg-secondary"
                >
                  <LinkIcon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                  <span className="font-medium text-foreground hover:text-primary">{resource.title}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-sm text-muted-foreground">No resources available for your career path yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
