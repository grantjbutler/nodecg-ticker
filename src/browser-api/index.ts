export function createInstance(moduleId: string, data?: unknown) {
    nodecg.sendMessage('ticker:create-instance', {
        moduleId,
        data
    });
}