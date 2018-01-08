exports.seed = function(knex, Promise) {
    var view = `CREATE VIEW offender_managers_archive_view
    WITH SCHEMABINDING 
    AS
    SELECT
    om.Id AS om_id
    , w.Id AS workload_id
    , om.UniqueIdentifier AS unique_identifier
    , om.OffenderManagerTypeId AS om_type_id
    , w.LduId AS workload_ldu_id
    , ouTeam.Name AS team_name
    , om.Forename AS om_forename
    , om.Surname AS om_surname
    , w.TotalCases AS total_cases
    , w.TotalPoints AS total_points
    , w.SDRPoints AS sdr_points
    , w.SDRConversionPoints AS sdr_conversion_points
    , w.PAROMSPoints AS paroms_points
    , w.NominalTarget AS nominal_target
    , w.ContractedHoursPerWeek AS contracted_hours 
    , w.hoursReduction AS hours_reduction
    FROM dbo.OffenderManager om
    JOIN dbo.Workload w ON om.Id = w.OffenderManagerId
    JOIN dbo.OrganisationalUnit ouTeam ON w.TeamId = ouTeam.Id`

    var index = `CREATE UNIQUE CLUSTERED INDEX idx_offender_managers_archive_view
    ON dbo.offender_managers_archive_view(om_id, workload_id, unique_identifier, om_type_id, workload_ldu_id, 
    team_name, om_forename, om_surname, total_cases, total_points, sdr_points, sdr_conversion_points, 
    paroms_points, nominal_target, contracted_hours, hours_reduction)`

    return knex.schema
    .raw('DROP VIEW IF EXISTS dbo.archive_data_view;')
    .raw('DROP VIEW IF EXISTS dbo.aggregate_offender_managers_view;')
    .raw('DROP VIEW IF EXISTS dbo.offender_managers_archive_view;')
    .raw('SET ARITHABORT ON')
    .raw(view)
    .raw(index)
}