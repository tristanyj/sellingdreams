source("./1_prepare_input.R")

if (file.exists("input/processed/ads.rds")) {
  ads <- readRDS("input/processed/ads.rds")
  print("Successfully loaded ad expenditure data.")
} else {
  stop("Cannot find ads.rds. Make sure to run 1_prepare_input.R first")
}

output <- list()
output$ads <- list()

for (i in seq_len(nrow(ads))) {
  ad <- list(
    id = paste0(ads$year[i], "-", ads$category[i]),
    year = ads$year[i],
    category = ads$category[i],
    name = ads$name[i],
    client = ads$client[i],
    slogan = ads$slogan[i]
  )
  output$ads[[i]] <- ad
}

json_data <- jsonlite::toJSON(output, pretty = TRUE, auto_unbox = TRUE)
write(json_data, file = "output/ads.json")

print("Successfully processed ads and saved to output/ads.json")
