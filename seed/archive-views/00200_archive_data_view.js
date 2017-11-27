exports.seed = function(knex, Promise) {
    var view = `CREATE VIEW archive_data_view
    WITH SCHEMABINDING 
    AS
    SELECT
    om.unique_identifier AS unique_identifier
    , om.om_type_id AS om_type_id
    , om.ldu_name AS ldu_name
    , om.team_name AS team_name
    , om.om_name AS om_name
    , om.total_cases AS total_cases
    , om.total_points AS total_points
    , om.sdr_points AS sdr_points
    , om.sdr_conversion_points AS sdr_conversion_points
    , om.paroms_points AS paroms_points
    , om.nominal_target AS nominal_target
    , om.contracted_hours AS contracted_hours 
    , om.hours_reduction AS hours_reduction
    , n.HoursReduced AS reduction
    , n.Notes AS comments
    , n.LastUpdateDateTime AS reduction_date
    , n.LastUpdateUserId AS reduction_added_by
    FROM dbo.offender_managers_archive_view om
    LEFT JOIN dbo.Note n ON om.om_id = n.OffenderManagerId`

    /** 
    , IIF(om.om_id = n.OffenderManagerId, n.HoursReduced, null) AS reduction
    , IIF(om.om_id = n.OffenderManagerId, n.Notes, null) AS comments
    , IIF(om.om_id = n.OffenderManagerId, n.LastUpdateDateTime, null) AS reduction_date
    , IIF(om.om_id = n.OffenderManagerId, n.LastUpdateUserId, null) AS reduction_added_by
    , dbo.Note n
    */
    return knex.schema
    .raw('DROP VIEW IF EXISTS dbo.archive_data_view;')
    .raw('SET ARITHABORT ON')
    .raw(view)
    // .raw(index)
}