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
    mutate(across(-year, ~. * 1000000))

  # Categories to process
  categories <- c("radio", "television", "internet", "periodicals",
                  "out_of_home", "direct_mail", "yellow_pages", "miscellaneous")

  # Process data
  combined_data <- ad_data_clean %>%
    left_join(gdp_clean, by = "year") %>%
    # Remove group_by and handle year explicitly
    nest(data = -year) %>%
    mutate(processed = map2(year, data, function(yr, year_data) {
      # Rest of your processing code remains the same
      # Check if all categories are 0
      all_zeros <- all(map_dbl(categories[-8], ~year_data[[.]]) == 0)

      if (all_zeros) {
        year_data$miscellaneous <- year_data$nominal_total
      }

      category_values <- map_dbl(categories, ~year_data[[.]])
      ranks <- rank(-category_values, ties.method = "first")

      category_data <- list()

      category_data$categories <- map2(categories, ranks, function(cat, rank) {
        nominal_value <- year_data[[cat]]
        real_value <- round((nominal_value / year_data$gdp_deflator) * 100)
        total_value <- sum(category_values)
        proportion <- if (total_value > 0) nominal_value / total_value else 0

        list(
          nominal = nominal_value,
          real = real_value,
          rank = rank,
          proportion_of_ads = proportion
        )
      }) %>% setNames(categories)

      category_data$total <- list(
        nominal = year_data$nominal_total,
        real = round((year_data$nominal_total / year_data$gdp_deflator) * 100),
        proportion_of_gdp = year_data$nominal_total / year_data$nominal_gdp
      )

      category_data$gdp <- list(
        nominal = year_data$nominal_gdp,
        real = year_data$real_gdp,
        deflator = year_data$gdp_deflator
      )

      c(list(year = yr), category_data)
    }))

  # Convert to array format
  result <- list(
    figures = combined_data %>%
      select(processed) %>%
      pull(processed)
  )

  return(result)
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

output <- process_figures(ad_data, gdp_data)

json_data <- jsonlite::toJSON(output, pretty = TRUE, auto_unbox = TRUE)
write(json_data, file = "output/figures.json")

print("Successfully processed figures and saved to output/figures.json")
