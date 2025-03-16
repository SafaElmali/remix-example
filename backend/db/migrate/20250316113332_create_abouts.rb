class CreateAbouts < ActiveRecord::Migration[7.2]
  def change
    create_table :about do |t|
      t.string :title
      t.text :description
      t.text :content

      t.timestamps
    end
  end
end
