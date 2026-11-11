import { opencodeByokModelId } from '../byok-opencode.js';
import {
  OPENCODE_PERMISSION_CAPABILITY,
  appendOpenCodePermissionBypass,
} from '../opencode-permissions.js';
import { DEFAULT_MODEL_OPTION } from './shared.js';
import type { RuntimeAgentDef } from '../types.js';

export const byokOpenCodeAgentDef = {
  id: 'byok-opencode',
  name: 'BYOK OpenCode',
  bin: 'opencode-cli',
  fallbackBins: ['opencode'],
  versionArgs: ['--version'],
  ...OPENCODE_PERMISSION_CAPABILITY,
  fallbackModels: [DEFAULT_MODEL_OPTION],
  buildArgs: (_prompt, _imagePaths, _extra, options = {}) => {
    const args = ['run', '--format', 'json'];
    // OpenCode 2.x dropped `run --dir`; the spawned process cwd is the session
    // workspace, so spawn({ cwd }) alone pins the selected project.
    appendOpenCodePermissionBypass(args, 'byok-opencode');
    const model = opencodeByokModelId(options.model);
    if (model) args.push('-m', model);
    return args;
  },
  promptViaStdin: true,
  streamFormat: 'json-event-stream',
  eventParser: 'opencode',
  externalMcpInjection: 'opencode-env-content',
  supportsCustomModel: true,
} satisfies RuntimeAgentDef;
