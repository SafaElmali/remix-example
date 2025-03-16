class About < ApplicationRecord
  self.table_name = "about"
  
  validates :title, presence: true
  validates :description, presence: true
  # content can be optional
end
