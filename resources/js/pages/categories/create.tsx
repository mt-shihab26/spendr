import { AppLayout } from '@/components/layouts/app-layout';
import { Heading } from '@/components/elements/heading';
import { BackButton } from '@/components/elements/back-button';
import { CategoryForm } from '@/components/screens/categories/category-form';

const CategoriesCreate = () => {
    return (
        <AppLayout
            title="New Category"
            description="Add a new income or expense category"
            breadcrumbs={[
                { title: 'Categories', route: 'categories.index' },
                { title: 'New Category', route: 'categories.create' },
            ]}
        >
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-start justify-between">
                    <Heading
                        title="New Category"
                        description="Add a new income or expense category"
                    />
                    <BackButton href={route('categories.index')} />
                </div>
                <div className="mx-auto w-full max-w-lg border p-4">
                    <CategoryForm />
                </div>
            </div>
        </AppLayout>
    );
};

export default CategoriesCreate;
