const Promise = require('bluebird')
const PythonBridge = require('python-bridge')
const config = require('../../config')

module.exports = function (reductions, capacity, formattedCaseloadData) {

  var python = PythonBridge()
  var outputFilename = config.WMT_DASHBOARD_OUTPUT_FILE_PATH + 'dashboard.xlsx'

  python.ex`
  from openpyxl import load_workbook
  from openpyxl import Workbook
  import json
  import os
  def write_dashboard(reductions, capacity, caseload, templateFilepath, outputFilepath, outputDirectory):
    if not os.path.exists(outputDirectory):
      os.makedirs(outputDirectory)
    '''wb = Workbook()'''
    '''wb.create_sheet(title="caseload data")'''
    '''wb.create_sheet(title="reductions data")'''
    '''wb.create_sheet(title="capacity data")'''

    workbook = load_workbook(filename=templateFilepath)
    populate_data(reductions, workbook, 'reductions data')
    populate_data(capacity, workbook, 'capacity data')
    populate_data(caseload, workbook, 'caseload data')
    workbook.save(filename=outputFilepath)
  def populate_data(data, workbook, sheetName):
    rowNum = 2
    colNum = 1
    worksheet = workbook[sheetName]
    for d in data:
      for col in d:
        worksheet.cell(row=rowNum, column=colNum).value = col
        colNum = colNum + 1
      colNum = 1
      rowNum = rowNum + 1
    print ('Finished', sheetName)`

  
  python`write_dashboard(${reductions}, ${capacity}, ${formattedCaseloadData}, ${config.WMT_DASHBOARD_TEMPLATE_FILE_PATH}, ${outputFilename}, ${config.WMT_DASHBOARD_OUTPUT_FILE_PATH})`
  python.end()
  return outputFilename
}