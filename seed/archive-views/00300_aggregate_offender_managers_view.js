exports.seed = function (knex, Promise) {
  var view = `CREATE VIEW aggregate_offender_managers_view
  WITH SCHEMABINDING 
  AS
  SELECT
  unique_identifier AS unique_identifier
  , om_id AS om_id
  , om_type_id AS om_type_id
  , workload_id
  , workload_ldu_id
  , team_name AS team_name
  , CONCAT(om_forename, ' ', om_surname) AS om_name
  , SUM(total_cases) AS total_cases
  , SUM(total_points) AS total_points
  , SUM(sdr_points) AS sdr_points
  , SUM(sdr_conversion_points) AS sdr_conversion_points
  , SUM(paroms_points) AS paroms_points
  , SUM(nominal_target) AS nominal_target
  , SUM(contracted_hours) AS contracted_hours 
  , SUM(hours_reduction) AS hours_reduction
  FROM dbo.offender_managers_archive_view WITH (NOEXPAND)
  GROUP BY unique_identifier, om_id, om_type_id, workload_id, workload_ldu_id, 
  team_name, om_forename, om_surname`

  return knex.schema
  .raw('DROP VIEW IF EXISTS dbo.aggregate_offender_managers_view;')
  .raw('SET ARITHABORT ON')
  .raw(view)
}
