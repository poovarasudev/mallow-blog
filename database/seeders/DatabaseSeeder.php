<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 15 users with 3-10 posts each
        User::factory(15)
            ->create()
            ->each(function ($user) {
                // Random number of posts between 3 and 10
                $numPosts = rand(3, 10);

                // Blog post topics for realistic titles
                $topics = [
                    'Tech' => [
                        'The Future of AI Development in %d',
                        'Why Docker Changed Everything About Development',
                        'Understanding Blockchain Technology',
                        'The Rise of Serverless Architecture',
                        'Best Practices for API Security',
                    ],
                    'Programming' => [
                        'Getting Started with Laravel %d',
                        'Advanced TypeScript Patterns',
                        'Clean Code Principles Every Developer Should Know',
                        'Mastering Git Workflows',
                        'Test-Driven Development in Practice',
                    ],
                    'Career' => [
                        'How to Ace Your Tech Interview',
                        'Remote Work Best Practices',
                        'Building Your Developer Portfolio',
                        'Navigating Your Tech Career Path',
                        'Soft Skills in Software Development',
                    ],
                ];

                for ($i = 0; $i < $numPosts; $i++) {
                    // Select random topic and title
                    $category = array_rand($topics);
                    $titleTemplate = $topics[$category][array_rand($topics[$category])];
                    $title = sprintf($titleTemplate, date('Y'));

                    Post::create([
                        'user_id' => $user->id,
                        'title' => $title,
                        'content' => $this->generatePostContent($category),
                    ]);
                }
            });
    }

    private function generatePostContent(string $category): string
    {
        // Simulate rich text editor content with HTML
        $faker = \Faker\Factory::create();

        $content = '<h2>'.$faker->sentence(6)."</h2>\n\n";

        // Introduction paragraph
        $content .= '<p>'.$faker->paragraph(3)."</p>\n\n";

        // Main content with subheadings
        for ($i = 0; $i < 3; $i++) {
            $content .= '<h3>'.$faker->sentence(4)."</h3>\n\n";
            $content .= '<p>'.$faker->paragraph(4)."</p>\n\n";

            // Add a list sometimes
            if ($faker->boolean(70)) {
                $content .= "<ul>\n";
                for ($j = 0; $j < 4; $j++) {
                    $content .= '    <li>'.$faker->sentence(6)."</li>\n";
                }
                $content .= "</ul>\n\n";
            }
        }

        // Add a code block for tech posts
        if ($category === 'Tech' || $category === 'Programming') {
            $content .= "<pre><code class=\"language-php\">\n";
            $content .= "public function example() {\n";
            $content .= "    \$data = collect(['foo' => 'bar']);\n";
            $content .= "    return \$data->map(function (\$item) {\n";
            $content .= "        return strtoupper(\$item);\n";
            $content .= "    });\n";
            $content .= "}\n";
            $content .= "</code></pre>\n\n";
        }

        // Conclusion
        $content .= "<h3>Conclusion</h3>\n\n";
        $content .= '<p>'.$faker->paragraph(3)."</p>\n\n";

        return $content;
    }
}
