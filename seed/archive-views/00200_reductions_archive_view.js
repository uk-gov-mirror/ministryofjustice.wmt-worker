exports.seed = function(knex, Promise) {
    var view = `CREATE VIEW reductions_archive_view
    WITH SCHEMABINDING 
    AS
    SELECT
    n.Id AS reduction_id
    , n.OffenderManagerId AS offender_manager_id
    , n.HoursReduced AS reduction
    , n.Notes AS comments
    , n.LastUpdateDateTime AS reduction_date
    , n.LastUpdateUserId AS reduction_added_by
    FROM dbo.Note n`

    var index = `CREATE UNIQUE CLUSTERED INDEX idx_reductions_archive_view
    ON dbo.reductions_archive_view(reduction_id, offender_manager_id, reduction, reduction_date, reduction_added_by)`
    
    return knex.schema
    .raw('DROP VIEW IF EXISTS dbo.reductions_archive_view;')
    .raw('SET ARITHABORT ON')
    .raw(view)
    .raw(index)
}