class About < ApplicationRecord
  self.table_name = "about"
  
  validates :title, presence: true
  validates :description, presence: true
  validates :content, presence: true
end
