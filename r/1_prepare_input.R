library(tidyverse)
library(jsonlite)
library(dplyr)

files <- list(
  "ad_expenditure" = "input/raw/ad_expenditure.csv",
  "gdp" = "input/raw/gdp.csv"
)

for (i in seq_along(files)) {
  name <- names(files)[i]
  print(paste("[", i, "/", length(files), "] Reading ", files[[name]], sep = ""))

  data <- read.csv(files[[name]], sep = ";")
  saveRDS(data, file.path("input/processed", paste0(name, ".rds")))
}
