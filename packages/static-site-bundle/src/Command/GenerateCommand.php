<?php

declare(strict_types=1);

namespace CJean\StaticSiteBundle\Command;

use CJean\StaticSiteBundle\Generation\SiteBuilder;
use CJean\StaticSiteBundle\Routing\RoutePlanner;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'ssg:generate',
    description: 'Render the opted-in routes and publish a static site.',
    aliases: ['ssg:build'],
)]
final class GenerateCommand extends Command
{
    public function __construct(
        private readonly SiteBuilder $builder,
        private readonly RoutePlanner $planner,
        private readonly string $environment,
        private readonly bool $debug,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption(
            'dry-run',
            null,
            InputOption::VALUE_NONE,
            'Validate and list routes without rendering or writing.',
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        if ($input->getFirstArgument() === 'ssg:build') {
            $io->warning('The "ssg:build" command is deprecated, use "ssg:generate" instead.');
        }
        if ($this->environment !== 'prod' || $this->debug) {
            $io->error('Use APP_ENV=prod APP_DEBUG=0 to avoid publishing debug pages or development assets.');
            return Command::FAILURE;
        }
        try {
            if ($input->getOption('dry-run')) {
                $pages = $this->planner->pages();
                foreach ($pages as $page) {
                    $io->writeln(sprintf('%s%s', $page->url, $page->sitemap === false ? ' (not in sitemap)' : ''));
                }
                $io->success(sprintf('%d routes planned.', count($pages)));
            } else {
                $result = $this->builder->build();
                $io->success(sprintf('%d files published.', $result->files));
                foreach ($result->warnings as $warning) {
                    $io->warning($warning);
                }
            }
            return Command::SUCCESS;
        } catch (\Throwable $error) {
            $io->error($error->getMessage());
            if ($output->isVerbose()) {
                throw $error;
            }
            return Command::FAILURE;
        }
    }
}
