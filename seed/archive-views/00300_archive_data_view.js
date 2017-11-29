exports.seed = function(knex, Promise) {
    var view = `CREATE VIEW archive_data_view
    WITH SCHEMABINDING 
    AS
    SELECT
    om.unique_identifier AS unique_identifier
    , om.om_type_id AS om_type_id
    , ouLdu.Name AS ldu_name
    , om.team_name AS team_name
    , CONCAT(om.om_forename, ' ', om.om_surname) AS om_name
    , SUM(om.total_cases) AS total_cases
    , SUM(om.total_points) AS total_points
    , SUM(om.sdr_points) AS sdr_points
    , SUM(om.sdr_conversion_points) AS sdr_conversion_points
    , SUM(om.paroms_points) AS paroms_points
    , om.nominal_target AS nominal_target
    , SUM(om.contracted_hours) AS contracted_hours 
    , SUM(om.hours_reduction) AS hours_reduction
    , n.reduction AS reduction
    , n.comments AS comments
    , n.reduction_date AS reduction_date
    , n.reduction_added_by AS reduction_added_by
    FROM dbo.offender_managers_archive_view om
    JOIN dbo.OrganisationalUnit ouLdu ON om.workload_ldu_id = ouLdu.Id
    LEFT JOIN dbo.reductions_archive_view n ON om.om_id = n.offender_manager_id
    GROUP BY om.unique_identifier, om.om_type_id, ouLdu.Name, om.team_name, 
    om.om_forename, om.om_surname, om.nominal_target, om.total_cases, om.total_points, om.sdr_points, 
    om.sdr_conversion_points, om.paroms_points, om.contracted_hours, 
    om.hours_reduction, n.reduction, n.comments, n.reduction_date, n.reduction_added_by`

    return knex.schema
    .raw('DROP VIEW IF EXISTS dbo.archive_data_view;')
    .raw('SET ARITHABORT ON')
    .raw(view)
}