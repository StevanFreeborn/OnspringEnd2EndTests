import { App, FakeDataFactory, SlackMessage } from '@stevanfreeborn/onspring-models';
import {
  ContentTasks,
  SlackMessageHistoryReportTargets,
  SlackMessageHistoryReportTasks,
  SlackMessageTasks,
} from '@stevanfreeborn/onspring-ui';
import { Retry } from '@stevanfreeborn/screenplay-playwright';
import { AppFixture, expect, test as base } from '../../fixtures';
import { AnnotationType } from '../annotations';

type SlackMessageHistoryReportTestFixtures = {
  app: App;
};

const test = base.extend<SlackMessageHistoryReportTestFixtures>({
  app: AppFixture.create().build(),
});

test.describe('slack message history report', () => {
  test.slow();

  test('Filter the Slack message history report', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-467',
    });

    const slackMessageName = FakeDataFactory.createFakeSlackMessageName();
    const slackMessage = new SlackMessage({
      appName: app.name,
      name: slackMessageName,
      messageTitle: `${slackMessageName} Title`,
      message: `Slack history filter message ${slackMessageName}`,
      channelName: 'general',
      status: true,
      sendOnSave: 'Always',
    });

    await test.step('Configure and enable a Slack message for the app', async () => {
      await sysAdminActor.attemptsTo(
        SlackMessageTasks.goto(),
        SlackMessageTasks.createFromAdminPage(app.name, slackMessage.name),
        SlackMessageTasks.update(slackMessage),
        SlackMessageTasks.save()
      );
    });

    await test.step('Send a Slack message by adding a record to the app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
    });

    await test.step('Navigate to the Slack message history report', async () => {
      await sysAdminActor.attemptsTo(SlackMessageHistoryReportTasks.goto());
    });

    await test.step('Filter the Slack message history report', async () => {
      await sysAdminActor.attemptsTo(
        SlackMessageHistoryReportTasks.filterReport({
          appOrSurvey: app.name,
          dateFilter: { type: 'Last 24 Hours' },
          channel: slackMessage.channelName,
          status: 'Failed',
          messageContains: slackMessageName,
        })
      );
    });

    await test.step('Verify the filtered report contains only the sent Slack message', async () => {
      await sysAdminActor.attemptsTo(
        Retry.until(
          async actor => {
            await actor.attemptsTo(SlackMessageHistoryReportTasks.reload());
            await actor.browse().check(SlackMessageHistoryReportTargets.rows).hasCount(1);
          },
          { intervals: [2_000, 5_000, 10_000], timeout: 120_000 }
        )
      );

      await sysAdminActor.browse().check(SlackMessageHistoryReportTargets.appNameCells).hasText(app.name);
      await sysAdminActor.browse().check(SlackMessageHistoryReportTargets.itemNameCells).hasText(slackMessage.name);
      await sysAdminActor.browse().check(SlackMessageHistoryReportTargets.statusCells).hasText('Failed');
      await sysAdminActor
        .browse()
        .check(SlackMessageHistoryReportTargets.channelCells)
        .hasText(slackMessage.channelName);
    });
  });

  test('Sort the Slack message history report', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-468',
    });

    const messagePrefix = FakeDataFactory.createFakeSlackMessageName();
    const slackMessages = [
      new SlackMessage({
        appName: app.name,
        name: `${messagePrefix}-a`,
        messageTitle: `${messagePrefix} A Title`,
        message: `Slack history sort message ${messagePrefix} A`,
        channelName: 'general',
        status: true,
        sendOnSave: 'Always',
      }),
      new SlackMessage({
        appName: app.name,
        name: `${messagePrefix}-z`,
        messageTitle: `${messagePrefix} Z Title`,
        message: `Slack history sort message ${messagePrefix} Z`,
        channelName: 'random',
        status: true,
        sendOnSave: 'Always',
      }),
    ];

    await test.step('Configure and enable two Slack messages for the app', async () => {
      for (const slackMessage of slackMessages) {
        await sysAdminActor.attemptsTo(
          SlackMessageTasks.goto(),
          SlackMessageTasks.createFromAdminPage(app.name, slackMessage.name),
          SlackMessageTasks.update(slackMessage),
          SlackMessageTasks.save()
        );
      }
    });

    await test.step('Send both Slack messages by adding a record to the app', async () => {
      await sysAdminActor.attemptsTo(ContentTasks.gotoAdd(app.id), ContentTasks.saveRecord());
    });

    await test.step('Navigate to the Slack message history report', async () => {
      await sysAdminActor.attemptsTo(SlackMessageHistoryReportTasks.goto());
    });

    await test.step('Filter the Slack message history report to the sent messages', async () => {
      await sysAdminActor.attemptsTo(
        SlackMessageHistoryReportTasks.filterReport({
          appOrSurvey: app.name,
          messageContains: messagePrefix,
        })
      );
    });

    await test.step('Wait for both Slack messages to appear in the report', async () => {
      await sysAdminActor.attemptsTo(
        Retry.until(
          async actor => {
            await actor.attemptsTo(SlackMessageHistoryReportTasks.reload());
            await actor.browse().check(SlackMessageHistoryReportTargets.rows).hasCount(2);
          },
          { intervals: [2_000, 5_000, 10_000], timeout: 120_000 }
        )
      );
    });

    await test.step('Sort the Slack message history report by Slack Channel', async () => {
      await sysAdminActor.attemptsTo(
        SlackMessageHistoryReportTasks.clearGridSorting(),
        SlackMessageHistoryReportTasks.sortGridBy('Slack Channel', 'ascending')
      );
    });

    await test.step('Verify the Slack message history report is sorted', async () => {
      const channels = (await sysAdminActor.browse().getAllTexts(SlackMessageHistoryReportTargets.channelCells)).map(
        channel => channel.trim()
      );

      expect(channels).toEqual([...channels].sort((a, b) => a.localeCompare(b)));
      await sysAdminActor.browse().check(SlackMessageHistoryReportTargets.rowAt(0)).containsText(slackMessages[0].name);
      await sysAdminActor.browse().check(SlackMessageHistoryReportTargets.rowAt(1)).containsText(slackMessages[1].name);
    });
  });
});
