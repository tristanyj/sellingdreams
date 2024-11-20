source("./1_prepare_input.R")

# ----------------------------
# Functions
# ----------------------------

process_figures <- function(ad_data, gdp_data) {
  # Clean GDP data first
  gdp_clean <- gdp_data %>%
    mutate(across(-year, ~str_remove_all(., " "))) %>%
    mutate(across(-year, ~str_remove_all(., ","))) %>%
    mutate(across(-year, ~as.numeric(.))) %>%
    # Convert GDP values from millions to dollars
    mutate(
      nominal_gdp = nominal_gdp * 1000000,
      real_gdp = real_gdp * 1000000
    )

  # Clean advertising data
  ad_data_clean <- ad_data %>%
    mutate(across(where(is.character), ~str_remove_all(., " "))) %>%
    mutate(across(where(is.character), ~as.numeric(.))) %>%
    mutate(across(-year, ~replace_na(., 0))) %>%
    rename(nominal_total = total) %>%
    # Convert all monetary values from millions to dollars
    mutate(across(-year, ~. * 1000000))

  # Merge and calculate
  combined_data <- ad_data_clean %>%
    left_join(gdp_clean, by = "year") %>%
    # Calculate real_total in dollars
    mutate(real_total = round((nominal_total / gdp_deflator) * 100)) %>%
    split(.$year) %>%
    map(as.list) %>%
    unname()

  return(combined_data)
}

# ----------------------------
# Main execution
# ----------------------------

if (file.exists("input/processed/ad_expenditure.rds")) {
  ad_data <- readRDS("input/processed/ad_expenditure.rds")
  print("Successfully loaded ad expenditure data.")
} else {
  stop("Cannot find ad_expenditure.rds. Make sure to run 1_prepare_input.R first")
}

if (file.exists("input/processed/gdp.rds")) {
  gdp_data <- readRDS("input/processed/gdp.rds")
  print("Successfully loaded gdp data.")
} else {
  stop("Cannot find gdp.rds. Make sure to run 1_prepare_input.R first")
}

output <- list()
output$figures <- process_figures(ad_data, gdp_data)

json_data <- jsonlite::toJSON(output, pretty = TRUE, auto_unbox = TRUE)
write(json_data, file = "output/figures.json")

print("Successfully processed figures and saved to output/figures.json")
