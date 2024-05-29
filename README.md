# EOL Alert GitHub Action

EOL Alert is a GitHub Action that alerts you about the End-of-Life (EOL) of major software versions to multiple messaging channels, including Slack, Discord, and Microsoft Teams.

![CI](https://github.com/insectkorea/eol-alert/actions/workflows/ci.yml/badge.svg)

## Features

- Supports multiple programming languages.
- Sends notifications to multiple messaging platforms.
- Easy to configure and extend.

## Supported Languages

- Go (go)
- Node.js (nodejs)
- Python (python)
- Ruby (ruby)
- Rust (rust)

## Supported Channels

- Slack
- Discord
- Microsoft Teams

## Usage

To use this action, create a workflow file (e.g., `.github/workflows/eol-alert.yml`) in your GitHub repository with the following content:

```yaml
name: EOL Alert

on:
  schedule:
    - cron: '0 0 * * *' # Runs daily at midnight
  workflow_dispatch:

jobs:
  eol-alert:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Run EOL Alert
        uses: insectkorea/eol-alert@v1
        with:
          language: 'golang'
          slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          discord-webhook-url: ${{ secrets.DISCORD_WEBHOOK_URL }}
          teams-webhook-url: ${{ secrets.TEAMS_WEBHOOK_URL }}
```

## Inputs

| Name                  | Description                           | Required | Default |
| --------------------- | ------------------------------------- | -------- | ------- |
| `language`            | Programming language to check for EOL | Yes      |         |
| `slack-webhook-url`   | Webhook URL for Slack                 | No       |         |
| `discord-webhook-url` | Webhook URL for Discord               | No       |         |
| `teams-webhook-url`   | Webhook URL for Microsoft Teams       | No       |         |

## Example

```yaml
name: EOL Alert

on:
  schedule:
    - cron: '0 0 * * *' # Runs daily at midnight
  workflow_dispatch:

jobs:
  eol-alert:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Run EOL Alert
        uses: insectkorea/eol-alert@v1
        with:
          language: 'node'
          slack-webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          discord-webhook-url: ${{ secrets.DISCORD_WEBHOOK_URL }}
          teams-webhook-url: ${{ secrets.TEAMS_WEBHOOK_URL }}
          google-chat-webhook-url: ${{ secrets.GOOGLE_CHAT_WEBHOOK_URL }}
```

## Development

### Prerequisites

- Node.js
- Yarn

### Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/insectkorea/eol-alert.git
    cd eol-alert
    ```

2. Install dependencies:
    ```sh
    yarn install
    ```

3. Build the project:
    ```sh
    yarn build
    ```

4. Run tests:
    ```sh
    yarn test
    ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.