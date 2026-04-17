/**
 * Business Rule: Auto Watchlist
 * Table: task
 * When: before
 * Active: true
 *
 * Evaluates all active watchlist conditions against the current task record.
 * If a condition matches, the associated recipients are added to the task's
 * watch_list field. Optionally posts a display message as a work note.
 */
(function executeRule(current, previous) {
    var condGR = new GlideRecord('x_auto_watchlist_conditions');
    condGR.addQuery('active', true);
    condGR.query();

    while (condGR.next()) {
        if (GlideFilter.checkRecord(current, condGR.getValue('condition'))) {
            var recipientIds = condGR.getValue('recipient');

            if (recipientIds) {
                var ids = recipientIds.split(',');
                for (var i = 0; i < ids.length; i++) {
                    var recipGR = new GlideRecord('x_auto_watchlist_recipients');
                    if (recipGR.get(ids[i].trim())) {
                        var email = recipGR.getValue('email');
                        if (email) {
                            if (!gs.nil(condGR.display_message)) {
                                current.work_notes = condGR.display_message.toString();
                            }
                            addToWatchList(current, email);
                        }
                    }
                }
            }
        }
    }

    function addToWatchList(taskRecord, email) {
        var currentList = taskRecord.getValue('watch_list') || '';
        var entries = currentList ? currentList.split(',') : [];
        if (entries.indexOf(email) === -1) {
            entries.push(email);
            taskRecord.setValue('watch_list', entries.join(','));
        }
    }
})(current, previous);
