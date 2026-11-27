import { App, FakeDataFactory, SlackMessage } from '@stevanfreeborn/onspring-models';
import {
  ContentTasks,
  SlackMessageHistoryReportTargets,
  SlackMessageHistoryReportTasks,
  SlackMessageTasks,
  SystemReportQuestions,
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

  test('Export the Slack message history report', async ({
    app,
    sysAdminActor,
    sysAdminUser,
    sysAdminEmail,
    downloadService,
    sheetParser,
  }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-469',
    });

    const messagePrefix = FakeDataFactory.createFakeSlackMessageName();
    const slackMessage = new SlackMessage({
      appName: app.name,
      name: messagePrefix,
      messageTitle: `${messagePrefix} Title`,
      message: `Slack history export message ${messagePrefix}`,
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

    await test.step('Filter the Slack message history report to the sent message', async () => {
      await sysAdminActor.attemptsTo(
        SlackMessageHistoryReportTasks.filterReport({
          appOrSurvey: app.name,
          messageContains: messagePrefix,
        })
      );
    });

    await test.step('Wait for the Slack message to appear in the report', async () => {
      await sysAdminActor.attemptsTo(
        Retry.until(
          async actor => {
            await actor.attemptsTo(SlackMessageHistoryReportTasks.reload());
            await actor.browse().check(SlackMessageHistoryReportTargets.rows).hasCount(1);
          },
          { intervals: [2_000, 5_000, 10_000], timeout: 120_000 }
        )
      );
    });

    await test.step('Export the Slack message history report', async () => {
      await sysAdminActor.attemptsTo(SlackMessageHistoryReportTasks.exportReport());
    });

    let exportEmailContent: string;

    await test.step('Verify the Slack message history report is exported', async () => {
      await expect(async () => {
        const searchCriteria = [
          ['TO', sysAdminUser.email],
          ['SUBJECT', 'Onspring Report Export Complete'],
          ['TEXT', 'Slack Message History'],
          ['UNSEEN'],
        ];
        const result = await sysAdminEmail.getEmailByQuery(searchCriteria);

        expect(result.isOk()).toBe(true);

        const email = result.unwrap();

        exportEmailContent = email.html as string;
      }).toPass({
        intervals: [30_000],
        timeout: 300_000,
      });
    });

    let reportPath: string;

    await test.step('Download the exported Slack message history report', async () => {
      const report = await sysAdminActor.asks(SystemReportQuestions.downloadedExportFromEmailHtml(exportEmailContent));
      reportPath = await downloadService.saveDownload(report);
    });

    await test.step('Verify the exported report contains the Slack message', async () => {
      const reportData = sheetParser.parseFile(reportPath);
      expect(reportData).toHaveLength(1);

      const sheet = reportData[0];
      expect(sheet.name).toEqual('Report Data');
      expect(sheet.data).toHaveLength(1);
      expect(sheet.data[0]).toEqual(
        expect.objectContaining({
          'Item Name': slackMessage.name,
          Status: 'Failed',
          'Slack Channel': slackMessage.channelName,
          'Time Created': expect.any(Date),
          'Time Sent': expect.any(Date),
        })
      );
    });
  });

  test('View the details of a Slack message history report item', async ({ app, sysAdminActor }) => {
    test.info().annotations.push({
      type: AnnotationType.TestId,
      description: 'Test-470',
    });

    const messagePrefix = FakeDataFactory.createFakeSlackMessageName();
    const slackMessage = new SlackMessage({
      appName: app.name,
      name: messagePrefix,
      messageTitle: `${messagePrefix} Title`,
      message: `Slack history details message ${messagePrefix}`,
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

    await test.step('Filter the Slack message history report to the sent message', async () => {
      await sysAdminActor.attemptsTo(
        SlackMessageHistoryReportTasks.filterReport({
          appOrSurvey: app.name,
          messageContains: messagePrefix,
        })
      );
    });

    await test.step('Wait for the Slack message to appear in the report', async () => {
      await sysAdminActor.attemptsTo(
        Retry.until(
          async actor => {
            await actor.attemptsTo(SlackMessageHistoryReportTasks.reload());
            await actor.browse().check(SlackMessageHistoryReportTargets.rows).hasCount(1);
          },
          { intervals: [2_000, 5_000, 10_000], timeout: 120_000 }
        )
      );
    });

    await test.step('Open the details of the Slack message history report item', async () => {
      await sysAdminActor.attemptsTo(SlackMessageHistoryReportTasks.openMessageDetails(slackMessage.name));
    });

    await test.step('Verify the Slack message details are displayed', async () => {
      const { messageDetailModal } = SlackMessageHistoryReportTargets;
      const timestampPattern = /\d{1,2}\/\d{1,2}\/\d{4} \d{1,2}:\d{2} [AP]M/;

      await sysAdminActor.browse().check(messageDetailModal.modal).isVisible();
      await sysAdminActor.browse().check(messageDetailModal.timeCreated).hasText(timestampPattern);
      await sysAdminActor.browse().check(messageDetailModal.timeSent).hasText(timestampPattern);
      await sysAdminActor.browse().check(messageDetailModal.channel).hasText(slackMessage.channelName);
      await sysAdminActor.browse().check(messageDetailModal.status).hasText('Failed');
      await sysAdminActor.browse().check(messageDetailModal.messageTitle).containsText(slackMessage.messageTitle);
      await sysAdminActor.browse().check(messageDetailModal.messageContent).containsText(slackMessage.message);
    });
  });
});
