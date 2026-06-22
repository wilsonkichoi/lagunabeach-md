import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getApiPath } from '../lib/knowledge.js';
import {
  renderArticleHeader,
  categoryEmoji,
  categoryLabel,
} from '../lib/render.js';
import { ensureData } from '../lib/ensure-data.js';

/**
 * Load dashboard-articles.json from the API path.
 */
function loadArticles() {
  const apiPath = getApiPath();
  const filePath = join(apiPath, 'dashboard-articles.json');
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Slugify a title for the read command hint.
 */
function slugify(title) {
  return (title || '')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '');
}

export function randomCommand(program) {
  program
    .command('random')
    .description('Discover a random Laguna Beach article')
    .option('-c, --category <cat>', 'Limit to category')
    .action(async (opts) => {
      try {
        await ensureData();
        const data = loadArticles();
        let articles = Array.isArray(data) ? data : data.articles || [];

        // Filter by category if specified
        if (opts.category) {
          articles = articles.filter(
            (a) =>
              (a.category || '').toLowerCase() === opts.category.toLowerCase(),
          );
        }

        if (articles.length === 0) {
          console.log(chalk.yellow('\n  No articles found.\n'));
          if (opts.category) {
            console.log(
              chalk.gray(
                '  💡 lagunabeachmd list --categories  →  see all categories\n',
              ),
            );
          } else {
            console.log(
              chalk.gray(
                '  💡 Run lagunabeachmd sync first to sync the knowledge base.\n',
              ),
            );
          }
          return;
        }

        // Pick a random article
        const index = Math.floor(Math.random() * articles.length);
        const article = articles[index];

        console.log(
          chalk.bold(
            `\n  🎲 Random pick (${index + 1} of ${articles.length})\n`,
          ),
        );

        // Render article header
        console.log(renderArticleHeader(article));
        console.log('');

        // Show first ~500 chars of description or content
        const description =
          article.description || article.excerpt || article.content || '';
        const preview =
          description.length > 500
            ? description.slice(0, 500) + '…'
            : description;

        if (preview) {
          console.log(chalk.white(`  ${preview}\n`));
        }

        // Slug for the read hint
        const slug = article.slug || article.id || slugify(article.title);

        // Footer hints
        console.log(chalk.gray('  ─'.repeat(30)));
        console.log(
          chalk.cyan(`  → lagunabeachmd read ${slug}`) +
            chalk.gray('  read full article'),
        );
        console.log(
          chalk.cyan('  → lagunabeachmd random') + chalk.gray('  another one'),
        );
        console.log('');
      } catch (err) {
        console.error(chalk.red(`Failed to load: ${err.message}`));
        console.log(
          chalk.gray(
            '\n  💡 Run lagunabeachmd sync first to sync the knowledge base.\n',
          ),
        );
        process.exit(1);
      }
    });
}
