packages <- c(
  "tidyverse",
  "jsonlite",
  "dplyr"
)

new_packages <- packages[!(packages %in% installed.packages()[, "Package"])]
if (length(new_packages)) install.packages(new_packages)
