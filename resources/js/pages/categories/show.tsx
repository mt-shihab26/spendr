import type { TCategory } from '@/types/models';

import { getIcon } from '@/lib/icons';

import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { EditButton } from '@/components/elements/edit-button';
import { BackButton } from '@/components/elements/back-button';
import { Badge } from '@/components/ui/badge';

const CategoriesShow = ({ category }: { category: TCategory }) => {
    return (
        <AppLayout
            title={category.name}
            description={category.name}
            breadcrumbs={[
                {
                    title: 'Categories',
                    route: 'categories.index',
                },
                {
                    title: category.name,
                    route: 'categories.show',
                    params: { category: category.id },
                },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title={category.name}
                        description={
                            category.is_default
                                ? `${category.type} · Default category`
                                : category.type
                        }
                        icon={getIcon(category.icon)}
                        color={category.color}
                    />
                    <div className="flex items-center">
                        <EditButton
                            href={route('categories.edit', category.id)}
                        />
                        <BackButton href={route('categories.index')} />
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">Type</p>
                        <Badge variant="secondary" className="mt-1 capitalize">
                            {category.type}
                        </Badge>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            Month Total
                        </p>
                        <p className="mt-1 text-lg font-semibold tabular-nums">
                            —
                        </p>
                    </div>
                    <div className="border p-4">
                        <p className="text-xs text-muted-foreground">
                            Transactions
                        </p>
                        <p className="mt-1 text-lg font-semibold tabular-nums">
                            —
                        </p>
                    </div>
                </div>
                <div className="border p-4">
                    <p className="text-xs text-muted-foreground">
                        No transactions yet.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
};

export default CategoriesShow;
